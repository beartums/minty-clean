/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React from 'react';

import $ from 'jquery';
import { FaSearch } from 'react-icons/fa';
import TransactionRow from './TransactionRow';

import RestClient from '../services/RestClient';
import { SORT, Sorter } from '../models/Sorter';
import ImportTransactionsButton from './ImportTransactionsButton';

class AllTransactions extends React.Component {
  constructor(props) {
    super(props);

    const itemCollection = this.props.collection || {};
    const sorter = new Sorter(itemCollection.items || []);
    sorter.addSummary('date', 1, SORT.DIRECTION.DESCENDING)
      .addSummary('category', 2, SORT.DIRECTION.ASCENDING)
      .addSummary('amount', 3, SORT.DIRECTION.ASCENDING);

    this.state = {
      search: null,
      sorter,
      sort: [
        { prop: 'date', direction: 'd' },
        { prop: 'category', direction: 'a' },
        { prop: 'amount', direction: 'a' },
      ],
    };
    this.searchTimeout = null;
  }

  // eslint-disable-next-line arrow-body-style
  getCategoryOptionList = () => {
    return this.props.categories.map((cat) => <option value={cat}>{cat}</option>);
  }

  updateSearch = () => {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const search = $('#search').val();
      this.setState({ search });
    }, 1000);
  }

  changeTransactionCategory = (transaction, newCategory) => {
    RestClient.updateTransaction(transaction, { category: newCategory })
      .then(() => {
        transaction.category = newCategory;
        this.setState((state) => ({ sorter: state.sorter }));
      });
  }

  deleteTransaction = (transaction) => {
    RestClient.deleteTransaction(transaction)
      .then(() => {
        this.props.collection.remove(transaction);
        // eslint-disable-next-line react/no-unused-state
        this.setState(() => ({ dummy: 1 }));
      });
  }

  handleUploadButtonClick = (e) => {
    this.props.uploadTransactions(e);
  }

  handleOverwriteClick = (e) => {
    this.props.uploadTransactions(e, true);
  }

  coalesce = (...args) => {
    for (let i = 0; i < args.length; i++) {
      if (args[i]) return args[i];
    }
    return null;
  }

  sort = (items, sortProps) => {
    sortProps = sortProps || this.state.sort;
    items = items || this.props.transactions;

    return items.sort((a, b) => {
      for (let i = 0; i < sortProps.length; i++) {
        const { prop } = sortProps[i]; const
          dir = sortProps[i].direction === 'd' ? -1 : 1;
        if (a[prop] < b[prop]) return -1 * dir;
        if (b[prop] < a[prop]) return dir;
      }
      return 0;
    });
  }

  render() {
    let transactions = this.props.collection ? this.props.collection.items : [];
    if (!transactions) return '';
    const optionList = this.getCategoryOptionList();
    transactions = transactions.filter((transaction) => {
      if (!this.state.search || this.state.search.trim() === '') return true;
      const t = transaction;
      const text = this.coalesce(t.description, '')
                  + this.coalesce(t.category, '')
                  + this.coalesce(t.account_name, '')
                  + this.coalesce(t.notes, '');
      return (text.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1);
    });

    transactions = this.state.sorter.sortList(transactions);

    return (
      <span>
        <ImportTransactionsButton
          handleClick={this.handleUploadButtonClick}
          buttonText="Upload New Transactions"
        />
        <ImportTransactionsButton
          handleClick={this.handleOverwriteClick}
          buttonText="Overwrite Transactions"
        />
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text"><FaSearch /></span>
          </div>
          <input id="search" className="form-control form-control" onChange={this.updateSearch} />
          <div className="input-group-append">
            <span className="input-group-text">{transactions.length}</span>
          </div>
        </div>
        <table className="table table-condensed table-xs">
          <tbody>
            { transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                optionList={optionList}
                changeCategory={this.changeTransactionCategory}
                deleteTransaction={this.deleteTransaction}
                fields={['date', 'description', 'amount', 'delete-button', 'edit-button', 'category', 'accountName']}
              />
            ))}
          </tbody>
        </table>
      </span>
    );
  }
}

export default AllTransactions;
