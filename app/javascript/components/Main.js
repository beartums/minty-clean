/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
// import PropTypes from 'prop-types';
import AllTransactions from './AllTransactions';
import CategoryGroups from './CategoryGroups';
// import Transaction from '../models/Transaction';
// import { getCategories } from '../services/transactionService';
// import { isoToDate } from '../services/dateService';
import SETTINGS from '../services/settings';

const TABS = {
  ALL: 'allTransactions',
  GROUPS: 'groups',
  TRANSACTIONS: 'transactions',
};

class Main extends React.Component {
  constructor(props) {
    console.time('setup');
    super(props);
    this.state = {
      transactions: [],
      minDate: null,
      maxDate: null,
      categories: [],
      tab: TABS.TRANSACTIONS,
      isLoading: true,
    };
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
    this.SETTINGS = SETTINGS;
  }

  render() {
    let div = '';
    if (this.state.isLoading) {
      div = (
        <div className="spinner-border spinner-border-xl text-center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    } else if (this.state.tab === TABS.ALL) {
      div = (
        <div>
          <h1>
            All Transactions (
            {this.state.transactions.length}
            )
          </h1>
          <AllTransactions
            transactions={this.state.transactions}
            categories={this.state.categories}
            uploadTransactions={this.handleUploadButtonClick}
          />
        </div>
      );
    } else if (this.state.tab === TABS.GROUPS) {
      div = (
        <div>
          <h1>
            Category Group Management
          </h1>
          <CategoryGroups
            transactions={this.state.filteredTransactions}
            minDate={this.state.minDate}
            maxDate={this.state.maxDate}
          />
        </div>
      );
    } else if (this.state.tab === TABS.TRANSACTIONS) {
      div = (
        <div>
          <h1>
            Transactions
          </h1>
        </div>
      );
    }

    return (
      <div>
        <div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${this.state.tab == TABS.ALL ? 'active' : ''} ${this.state.isLoading ? 'disabled' : ''}`}
                onClick={() => { this.setState({ tab: TABS.ALL }); }}
              >
                All Transactions
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${this.state.tab == TABS.GROUPS ? 'active' : ''} ${this.state.isLoading ? 'disabled' : ''}`}
                onClick={() => { this.setState({ tab: TABS.GROUPS }); }}
              >
                Expense Groups
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${this.state.tab == TABS.TRANSACTIONS ? 'active' : ''} ${this.state.isLoading ? 'disabled' : ''}`}
                onClick={() => { this.setState({ tab: TABS.TRANSACTIONS }); }}
              >
                Transactions
              </a>
            </li>
          </ul>
        </div>
        {div}
      </div>

    );
  }
}

Main.propTypes = {

};

export default Main;
