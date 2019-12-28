import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import Transaction from '../models/Transaction';
import CategoryGroup from '../models/CategoryGroup';
import Category from '../models/Category';

import DataService from '../services/dataService';
import {isoToDate} from '../services/dateService';
import {Settings, KEYS} from '../services/settings';

import CategoryGroups from './CategoryGroups';
import AllTransactions from './AllTransactions';

import { AiOutlineMan } from 'react-icons/ai';
import { GiTeapotLeaves } from 'react-icons/gi';
import * as _ from 'lodash';

/**
 * Router Component for application
 * @class App
 * @param  {any} props React Properties 
 * @extends React.Component
 */
class App extends React.Component {

  constructor(props) {
    console.time('setup')
    super(props);
    this.state = {
      isLoading: true
    }
  }

  /**
   * React hook; called after component has been rendered.  In this case used to load our transactions
   * @return {void}
   * @memberof App
   */
  componentDidMount() {
    this.fetchTransactions().then(() => this.setState({isLoading: false}));
  }

  /**
   * Fetch all transactions from the database and prepare them for display
   * @return {void}
   * @memberof App
   */
  fetchTransactions = () => {

    let minmaxP = DataService.getTransactionMinMaxDate();
    let transactionsP = DataService.getTransactions();
    let groupsP = DataService.getGroups();
    let membershipsP = DataService.getMemberships();

    return Promise.all([groupsP, membershipsP, minmaxP, transactionsP])
      .then( ([groups, memberships, minmax, transactions]) => {
        // groups
        groups.forEach( group => {
          new CategoryGroup(group);
        });
        new CategoryGroup({id: -2, name: 'UNCATEGORIZED'})

        // // memberships
        memberships.forEach( membership => {
          new Category(membership);
        })

        // // Transactions
        let filteredTransactions = [];
        transactions.forEach( transaction => {
          new Transaction(transaction);
          if (transaction.date < Settings.get(KEYS.PERIODS.FIRST_PERIOD).isoStartDate) return;
          filteredTransactions.push(transaction);
        })

        // // Date minmax
        const minDate = isoToDate(minmax.minDate,'2000-01-01');
        const maxDate = isoToDate(minmax.maxDate, '2019-12-31');

        let catKeys = Category.collection.getKeys('byName');
        let transCats = Transaction.collection.getKeys('byCategory')

        let categories = _.union(catKeys, transCats);

        this.setState({ 
          transactions: transactions,
          transactionCollection: Transaction.collection,
          groupCollection: CategoryGroup.collection,
          categoryCollection: Category.collection,
          categories: categories.sort(),
          filteredTransactions: filteredTransactions,
          minDate: minDate,
          maxDate: maxDate,
         }) ;
         console.timeEnd("setup");
         return transactions || [];
      })

  }

  /**
   * Uploads csv file of transactions; passed down to AllTransactions
   * @param e {FileEvent}
   * @return {void}
   * @memberof App
   */
  handleUploadButtonClick = (e) => {
    let file = e.target.files[0];

    DataService.uploadTransactions(file)
    .then(response => {
      console.log(response);
      this.fetchTransactions();
    })
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
              <a className="navbar-brand" title="MINTY! (you know...Men + Tea.  You get it, right?}" href="#">(<AiOutlineMan /><AiOutlineMan />) + <GiTeapotLeaves /></a>
              <div className="navbar-collapse collapse">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item"><Link className="nav-link" to="/">Summary</Link></li>
                  <li className="nav-item"><Link className="nav-link"  to="/details">Details</Link></li>
                  <li className="nav-item"><Link className="nav-link"  to="/settings">Settings</Link></li>
                </ul>
              </div>
            </nav>
            <Switch>
              <Route path="/details">
                <AllTransactions collection={this.state.transactionCollection}
                                  categories={this.state.categories}
                                  uploadTransactions={this.handleUploadButtonClick} />
              </Route>
              <Route path="/settings">
                {/* SETTINGS */}
              </Route>
              <Route path="/">
                <CategoryGroups transactions={this.state.filteredTransactions} 
                                  transactionCollection={this.state.transactionCollection}
                                  groupCollection = {this.state.groupCollection}
                                  categoryCollection = {this.state.categoryCollection}
                                  categories = { this.state.categories }
                                  minDate={this.state.minDate} 
                                  maxDate={this.state.maxDate} />
              </Route>
            </Switch>
          </BrowserRouter>
        )
      

    )
  }
}

export default App;