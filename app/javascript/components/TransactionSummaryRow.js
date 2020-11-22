/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React from 'react';
import * as numeral from 'numeral';
import PropTypes from 'prop-types';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

class TransactionSummaryRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSummarized: this.props.isSummarized,
    };
  }

  getDateFromIsoString = (isoDate) => {
    const dateArray = isoDate.split('-');
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  }

  // eslint-disable-next-line arrow-body-style
  getPeriodTransactions = (period, transactions) => {
    return transactions.filter((t) => t.date >= period.startDate && t.date < period.endDate);
  }

  getGroupTransactions = (group) => {
    const categories = Category.collection.get('byGroupId', { groupId: group.id });
    // eslint-disable-next-line array-callback-return
    // eslint-disable-next-line arrow-body-style
    const transactions = categories.reduce((all, cat) => {
      return all.concat(Transaction.collection.get('byCategory', { category: cat.name }));
    }, []);
    return transactions;
  }

  getPeriodGroupTransactions = (period, group) => {
    const t = this.getGroupTransactions(group);
    const transactions = this.getPeriodTransactions(period, t);
    return transactions;
  }

  // eslint-disable-next-line arrow-body-style
  summarizeTransactions = (transactions) => {
    return transactions.reduce((total, transaction) => total + transaction.signedAmount, 0);
  }

  getPeriodSummary = (period, group) => {
    const total = this.summarizeTransactions(this.getPeriodGroupTransactions(period, group));
    return total;
  }

  toggleSummarized = () => {
    this.setState((state) => ({ isSummarized: !state.isSummarized }));
    this.props.toggleSummarized(this.props.group);
  }

  showTransactions = (period, group) => {
    const trans = this.getPeriodGroupTransactions(period, group);
    this.props.showTransactions(period, group, trans.sort((a, b) => (a.date < b.date ? -1 : 1)));
  }

  hideTransactions = () => {
    this.props.hideTransactions(this.props.group);
  }

  render() {
    return (
      <tr>
        <td>
          <input
            type="checkbox"
            defaultChecked={this.state.isSummarized}
            onClick={this.toggleSummarized}
          />
        </td>
        <td onClick={this.hideTransactions}>
          {this.props.group.name}
        </td>
        { this.props.periods.map((period, idx) => (
          <td
            key={period.startDate}
            className="text-right"
            onClick={() => this.showTransactions(period, this.props.group)}
          >
            {numeral(this.getPeriodSummary(period, this.props.group, idx)).format('$0.00')}
          </td>
        ))}
      </tr>
    );
  }
}

export default TransactionSummaryRow;

TransactionSummaryRow.propTypes = {
  periods: PropTypes.arrayOf(PropTypes.shape({
    startDate: PropTypes.date,
    endDate: PropTypes.date,
  })).isRequired,
  group: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  }),
};
