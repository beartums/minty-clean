import React from 'react';
import { getSignedAmount } from '../services/transactionService';
import * as numeral from 'numeral';
import PropTypes from 'prop-types';
import { Period } from './classes';
import moment from 'moment';

class TransactionSummaryRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSummarized: this.props.isSummarized
    }
  }

  getDateFromIsoString = (isoDate) => {
    let dateArray = isoDate.split('-');
    return new Date(dateArray[0], dateArray[1]-1, dateArray[2])
  }

  getPeriodTotals = (categories, periods) => {

    let amountArray = new Array(periods.length).fill(0);
    categories.forEach(category => {
      category.transactions.forEach( (transaction) => {
        //let transDate = this.getDateFromIsoString(transaction.date);
        //if (periods[0].startDate > transDate || periods[periods.length-1].endDate <= transDate) return;
        for (let i = 0; i < periods.length; i++) {
          let period = periods[i];
          if (period.isInPeriod(transaction.date)) {
            amountArray[i] += getSignedAmount(transaction);
            break;
          }
        }        
      });
    });
    if (this.props.setFunction && typeof this.props.setTotals == 'function') {
      this.props.setTotals(amountArray);
    }
    return amountArray

  }
  findPeriodIndex = (transaction, periods, currentIndex) => {
    // periods will be in order from earliest to latest.  It is expected the transactions will be
    // also, so the best way to find the right one is move relative to the current period
    currentIndex = currentIndex || 0;
    let currentPeriod = periods[currentIndex];
    while (transaction.date < currentPeriod.startDate | transaction.date > currentPeriod.endDate) {
      if (transaction.date < currentPeriod.startDate) {
        currentPeriod = periods[--currentIndex]
      } else {
        currentPeriod = periods[++currentIndex]
      }
      if (!currentPeriod) throw new Error("period not found");
    }
    return currentIndex;
  }

  toggleSummarized = () => {
    this.setState({isSummarized: !this.state.isSummarized})
    this.props.toggleSummarized(this.props.group);
    return;
  }

  showTransactions = (period, categories) => {
    let trans = categories.reduce( (aggregatedTransactions, category) => {
      let newTrans = period.transactionsByCategory[category.name] || [];
      return aggregatedTransactions.concat(newTrans);
      
    }, [])
    this.props.showTransactions(trans.sort((a,b)=>a.date<b.date?-1:1));
  }

  hideTransactions = () => {
    this.props.hideTransactions(this.props.group);
  }
  render() {
    //let periodTotals = 
    // this.getPeriodTotals(this.props.group.categories, this.props.periods);
    return (
      <tr>
        <td><input type="checkbox" defaultChecked={this.state.isSummarized} onClick={this.toggleSummarized} /></td>
        <td onClick={this.hideTransactions}>{this.props.group.name}</td>
        { this.props.periods.map( (period,idx) => {
            return (
              <td key={idx} className="text-right" 
                onClick={() => this.showTransactions(period, this.props.group.categories)}>
                {numeral(period.getCategorySums(this.props.group.categories)).format('$0.00')}
              </td>
            )
          })
        }
      </tr>
    )

  }
}

export default TransactionSummaryRow;

TransactionSummaryRow.propTypes = {
  periods: PropTypes.arrayOf(PropTypes.shape({
    startDate: PropTypes.date,
    endDate: PropTypes.date,
  })).isRequired,
  group: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    categories: PropTypes.array
  }),
  setTotals: PropTypes.func
}