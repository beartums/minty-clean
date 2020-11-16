/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import * as numeral from 'numeral';
import moment from 'moment';
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { getSignedAmount } from '../services/transactionService';

class TransactionRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBeingEdited: false,
    };
  }

  changeCategory = (event) => {
    event.persist();
    console.log('Change Category:', event.target.value);
    this.setState({ isBeingEdited: false });
    this.props.changeCategory(this.props.transaction, event.target.value);
  }

  deleteTransaction = (event) => {
    event.persist();
    this.props.deleteTransaction(this.props.transaction);
  }

  editCategory = () => {
    this.setState((state) => ({ isBeingEdited: !state.isBeingEdited }));
  }

  getCategoryColumn = () => {
    if (!this.state.isBeingEdited) {
      return this.props.transaction.category;
    } if (this.state.isBeingEdited) {
      return (
        <select
          id={`${this.props.transaction.category}-category-select`}
          value={this.props.transaction.category}
          onChange={this.changeCategory}
        >
          {this.props.optionList}
        </select>
      );
    }
  }

  getCategoryEditColumn = () => (!this.state.isBeingEdited
    ? <FaEdit onClick={this.editCategory} />
    : <FaTimes onClick={this.editCategory} />)

  left = (string, length) => {
    if (!string) return '';
    if (string.length <= length) return string;
    return string.slice(0, length);
  }

  // eslint-disable-next-line consistent-return
  getCell = (transaction, fieldName, index) => {
    if (fieldName === 'description') {
      return (
        <td key={index} title={transaction.description}>
          {this.left(transaction.description, this.props.descriptionWidth)}
        </td>
      );
    }
    if (fieldName === 'amount') {
      return (
        <td className="text-right" key={index}>
          {numeral(getSignedAmount(this.props.transaction)).format('$0.00')}
        </td>
      );
    }
    if (fieldName === 'date') {
      return (
        <td key={index} title={moment(transaction.date).format('ddd, DD MMM, YYYY')}>
          {moment(transaction.date).format(this.props.dateFormat)}
        </td>
      );
    }
    if (fieldName === 'category') {
      return (
        <td key={index}>
          {this.getCategoryColumn(transaction)}
        </td>
      );
    }
    if (fieldName === 'accountName') {
      return (
        <td key={index}>
          {transaction.accountName}
        </td>
      );
    }
    if (fieldName === 'edit-button') {
      return (
        <td key={index} className="text-right">
          {this.getCategoryEditColumn(transaction)}
        </td>
      );
    }
    if (fieldName === 'delete-button') {
      return (
        <td key={index} className="text-right">
          <FaTrash onClick={this.deleteTransaction} />
        </td>
      );
    }
  }

  render() {
    return (
      <tr>
        {this.props.fields.map((field, index) => (
          this.getCell(this.props.transaction, field, index)
        ))}
      </tr>
    );
  }
}

export default TransactionRow;

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    amount: PropTypes.number,
    category: PropTypes.string,
    account: PropTypes.string,
    original_description: PropTypes.string,
  }),
  optionList: PropTypes.arrayOf(PropTypes.object),
  changeCategory: PropTypes.func,
  deleteTransaction: PropTypes.func,
  fields: PropTypes.arrayOf(PropTypes.string),
  dateFormat: PropTypes.string,
  descriptionWidth: PropTypes.number,
};

TransactionRow.defaultProps = {
  fields: ['date', 'description', 'amount', 'category', 'accountName'],
  dateFormat: 'DD MMM YY',
  descriptionWidth: 40,
};
