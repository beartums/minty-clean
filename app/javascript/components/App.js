/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-new */
import React from 'react';
import {
  BrowserRouter, Link, Route, Switch,
} from 'react-router-dom';

import { GiTeapotLeaves } from 'react-icons/gi';
import * as _ from 'lodash';
import { AiOutlineMan } from 'react-icons/ai';

import Transaction from '../models/Transaction';
import CategoryGroup from '../models/CategoryGroup';
import Category from '../models/Category';
import Period from '../models/Period';

import RestClient from '../services/RestClient';
import { isoToDate } from '../services/dateService';
import { Settings, KEYS } from '../services/settings';

import CategoryGroups from './CategoryGroups';
import AllTransactions from './AllTransactions';


/**
 * Router Component for application
 * @class App
 * @param  {any} props React Properties
 * @extends React.Component
 */
class App extends React.Component {
  constructor(props) {
    console.time('setup');
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  /**
   * React hook; called after component has been rendered.
   * In this case used to load our transactions
   * @return {void}
   * @memberof App
   */
  componentDidMount() {
    Category.createCollection();
    CategoryGroup.createCollection();
    Transaction.createCollection();
    Period.createCollection();
    this.fetchTransactions().then(() => this.setState({ isLoading: false }));
  }

  /**
   * Fetch all transactions from the database and prepare them for display
   * @return {void}
   * @memberof App
   */
  fetchTransactions = () => {
    const minmaxP = RestClient.getTransactionMinMaxDate();
    const transactionsP = RestClient.getTransactions();
    const groupsP = RestClient.getGroups();
    const membershipsP = RestClient.getMemberships();

    return Promise.all([groupsP, membershipsP, minmaxP, transactionsP])
      .then(([groups, memberships, minmax, transactions]) => {
        // groups
        groups.forEach((group) => {
          new CategoryGroup(group);
        });
        new CategoryGroup({ id: -2, name: 'UNCATEGORIZED' });

        // // memberships
        memberships.forEach((membership) => {
          new Category(membership);
        });

        // // Transactions
        const firstPeriod = Settings.get(KEYS.PERIODS.FIRST_PERIOD);

        const filteredTransactions = [];
        transactions.forEach((transaction) => {
          new Transaction(transaction);
          if (transaction.date < firstPeriod.isoStartDate) return;
          filteredTransactions.push(transaction);
        });

        // periods
        const periods = Period.getPeriodList(firstPeriod, new Date().toISOString());

        // // Date minmax
        const minDate = isoToDate(minmax.minDate, '2000-01-01');
        const maxDate = isoToDate(minmax.maxDate, '2019-12-31');

        const catCollection = Category.collection
        const transCollection = Transaction.collection
        const catKeys = catCollection ? catCollection.getKeys('byName') : [];
        const transCats = transCollection ? transCollection.getKeys('byCategory') : [];

        const categories = _.union(catKeys, transCats);

        this.setState({
          transactionCollection: Transaction.collection,
          periods,
          groupCollection: CategoryGroup.collection,
          categoryCollection: Category.collection,
          categories: categories.sort(),
          filteredTransactions,
          minDate,
          maxDate,
        });
        console.timeEnd('setup');
        return transactions || [];
      });
  }

  /**
   * Uploads csv file of transactions; passed down to AllTransactions
   * @param e {FileEvent}
   * @return {void}
   * @memberof App
   */
  handleUploadButtonClick = (e) => {
    const file = e.target.files[0];

    RestClient.uploadTransactions(file)
      .then((response) => {
        console.log(response);
        this.fetchTransactions();
      });
  }

  render() {
    return (
      // <div></div>
      this.state.isLoading ? (
        <div className="spinner-border spinner-border-xl text-center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <BrowserRouter>
          <nav className="navbar navbar-expand-sm  navbar-light bg-light">
            <a
              className="navbar-brand"
              title="MINTY! (you know...Men + Tea.  You get it, right?}"
              href="#"
            >
                (<AiOutlineMan /><AiOutlineMan />) + <GiTeapotLeaves />
            </a>
            <div className="navbar-collapse collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item"><Link className="nav-link" to="/">Summary</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/details">Details</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/settings">Settings</Link></li>
              </ul>
            </div>
          </nav>
          <Switch>
            <Route path="/details">
              <AllTransactions
                collection={this.state.transactionCollection}
                categories={this.state.categories}
                uploadTransactions={this.handleUploadButtonClick}
              />
            </Route>
            <Route path="/settings">
              {/* SETTINGS */}
            </Route>
            <Route path="/">
              <CategoryGroups
                transactions={this.state.filteredTransactions}
                periods={this.state.periods}
                transactionCollection={this.state.transactionCollection}
                groupCollection={this.state.groupCollection}
                categoryCollection={this.state.categoryCollection}
                categories={this.state.categories}
                minDate={this.state.minDate}
                maxDate={this.state.maxDate}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      )
    );
  }
}

export default App;
