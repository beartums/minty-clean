import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import moment from 'moment';
import Transaction from '../models/Transaction';
import DataService from '../services/dataService';
import {isoToDate} from '../services/dateService';
import LocalSettingsService from '../services/localSettingsService';
import SETTINGS from '../services/settings';
import CategoryGroups from './CategoryGroups';
import AllTransactions from './AllTransactions';
import { AiOutlineMan } from 'react-icons/ai';
import { GiTeapotLeaves } from 'react-icons/gi'

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
      isLoading: true,
      transactionManager: Transaction.collection
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
    return DataService.getTransactions()
      .then((response) => {return response.json()})
      .then((transactions) => {
        let minDate, maxDate, categories = {}, filteredTransactions = [];
        let instanceTransactions = [];
        transactions.forEach( transaction => {
          if (transaction.date < SETTINGS.IGNORE_BEFORE) return;
          instanceTransactions.push(new Transaction(transaction));
          if (!minDate || transaction.date<minDate) minDate = transaction.date;
          if (!maxDate || transaction.date>maxDate) maxDate = transaction.date;
          categories[transaction.category] = !categories[transaction.category] ? 1 : categories[transaction.category]+1;
          filteredTransactions.push(transaction);
        })
        minDate = isoToDate(minDate,'2000-01-01');
        maxDate = isoToDate(maxDate, '2019-12-31');

        this.setState({ 
          transactions: transactions,
          filteredTransactions: filteredTransactions,
          minDate: minDate,
          maxDate: maxDate,
          categories: Object.keys(categories).sort()
         }) ;
         console.timeEnd("setup");
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
    let file = e.target.files[0];

    DataService.uploadTransactions(file)
      .then(response => {
        console.log(response);
        this.fetchTransactions();
      })
  }

  render() {
    return (
      this.state.isLoading ? (
          <div className="spinner-border spinner-border-xl text-center" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <BrowserRouter>
            <nav className="navbar navbar-expand-sm  navbar-light bg-light">
              <a className="navbar-brand" title="MINTY! (of course, you know -- Men + Tea}" href="#">(<AiOutlineMan /><AiOutlineMan />) + <GiTeapotLeaves /></a>
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
                <AllTransactions transactions={this.state.transactions} 
                                  categories={this.state.categories}
                                  uploadTransactions={this.handleUploadButtonClick} />
              </Route>
              <Route path="/settings">
                {/* SETTINGS */}
              </Route>
              <Route path="/">
                <CategoryGroups transactions={this.state.filteredTransactions} 
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