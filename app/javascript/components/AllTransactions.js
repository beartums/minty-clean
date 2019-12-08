import React from "react"
import PropTypes from "prop-types"
import TransactionRow from "./TransactionRow";
import Transaction from '../models/Transaction';
import DataService from '../services/dataService';
import {SORT, Sorter} from '../models/Sorter';
import $ from 'jquery'
import ImportTransactionsForm from './ImportTransactionsForm';
import { FaSearch } from 'react-icons/fa'

class AllTransactions extends React.Component {
  constructor(props) {
    super(props);
    let sorter = new Sorter(this.props.transactions);
    sorter.addSummary('date',1,SORT.DIRECTION.DESCENDING)
              .addSummary('category',2,SORT.DIRECTION.ASCENDING)
              .addSummary('amount',3,SORT.DIRECTION.ASCENDING)
      
    this.state = {
      transactions: this.props.transactions, 
      DataService: DataService,
      search: null,
      sorter: sorter,
      sort: [
        {prop: 'date', direction: 'd'},
        {prop: 'category', direction: 'a'},
        {prop: 'amount', direction: 'a'},
      ]
    };
    this.searchTimeout = null;
  }
  getCategoryOptionList = () => {
    return this.props.categories.map( cat => {
      return <option value={cat}>{cat}</option>
    })
  }

  updateSearch = (e) => {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      let search = $(`#search`).val();
      this.setState({search: search});  
    }, 1000)
  }

  changeTransactionCategory = (transaction, newCategory) => {
    DataService.updateTransaction(transaction, {category: newCategory})
      .then(() => {
        transaction.category = newCategory;
        this.setState({transactions: this.props.transactions})
      })
  }
  handleUploadButtonClick = (e) => {
    this.props.uploadTransactions(e);
  }
  coalesce = (...args) => {
    for (let i = 0; i < args.length; i++) {
      if (args[i]) return args[i]
    }
    return null;
  }
  sort = (items, sortProps) => {
    sortProps = sortProps || this.state.sort;
    items = items || this.props.transactions;

    return items.sort( (a, b) => {
      for (let i = 0; i < sortProps.length; i++) {
        let prop = sortProps[i].prop, dir = sortProps[i].direction === 'd' ? -1 : 1;
        if (a[prop] < b[prop]) return -1 * dir;
        if (b[prop] < a[prop]) return dir
      }
      return 0;
    })
    return items;
  }

  render() {
    if (!this.props.transactions) return '';
    let optionList = this.getCategoryOptionList();
    let transactions = this.props.transactions.filter( transaction => {
      if (!this.state.search || this.state.search.trim() == '') return true;
      let t = transaction;
      let text = this.coalesce(t.description, '') 
                  + this.coalesce(t.category, '') 
                  + this.coalesce(t.account_name, '')
                  + this.coalesce(t.notes, '')
      return (text.toLowerCase().indexOf(this.state.search.toLowerCase())>-1);
    })
    
    transactions = this.state.sorter.sortList(transactions)
   
    return (
      <span>
        <ImportTransactionsForm handleClick={this.handleUploadButtonClick} />
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text"><FaSearch /></span>
          </div>
          <input id="search" className='form-control form-control' onChange={this.updateSearch} />
          <div className="input-group-append">
            <span className="input-group-text">{transactions.length}</span>
          </div>
        </div>
        <table className="table table-condensed table-xs">
          <tbody>
            { transactions.map( transaction => {
              return (
                <TransactionRow key={transaction.id} 
                              transaction={transaction} 
                              optionList={optionList} 
                              changeCategory={this.changeTransactionCategory}
                              fields={['date','description','amount','edit-button','category','account_name']} />
              )
            })
          }
          </tbody>
        </table>
      </span>
    );

  }
}

export default AllTransactions
