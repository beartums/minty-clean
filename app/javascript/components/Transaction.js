import React from "react";
import PropTypes from 'prop-types';
import { getSignedAmount } from '../services/transactionService';
import * as numeral from 'numeral';
import moment from 'moment';
import { FaEdit, FaTimes } from 'react-icons/fa';


class Transaction extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isBeingEdited: false
    }
  }


  changeCategory = (event) => {
    event.persist()
    console.log("Change Category:", event.target.value);
    this.setState({ isBeingEdited: false })
    this.props.changeCategory(this.props.transaction, event.target.value)
  }

  editCategory = () => {
    let isBeingEdited = !this.state.isBeingEdited;
    this.setState({isBeingEdited: isBeingEdited})
  }

  getCategoryColumn = () => {
    if (!this.props.showCategory) return null;

    if (this.props.showCategory && !this.state.isBeingEdited) {
        return this.props.transaction.category
    } else if (this.state.isBeingEdited) {
      return (
          <select id={`${this.props.transaction.category}-category-select`}
            value={this.props.transaction.category} onChange={this.changeCategory}>
            {this.props.optionList}
          </select>
      )
    }

  }
  getCategoryEditColumn = () => {
    if (this.props.allowCategoryEdit) {
      return !this.state.isBeingEdited ? 
                    <td><FaEdit onClick={this.editCategory} /></td> :
                    <td><FaTimes onClick={this.editCategory} /></td>
    }
  }

  left = (string, length) => {
    if (!string) return '';
    if (string.length <= length) return string;
    return string.slice(0,length);
  }

  getCell = (transaction, fieldName, index) => {
    if (fieldName == 'description') {
      return (
        <td key={index} title={transaction.description}>
          {this.left(transaction.description, this.props.descriptionWidth)}
        </td>
      )
    }
    if (fieldName == 'amount') {
      return (
        <td className="text-right" key={index}>
          {numeral(getSignedAmount(this.props.transaction)).format('$0.00')}
        </td>
      )
    }
    if (fieldName == 'date') {
      return (
        <td key={index}>
          {moment(transaction.date).format(this.props.dateFormat)}
        </td>
      )
    }
    if (fieldName == 'category') {
      return (
        <td key={index}>
          {this.getCategoryColumn(transaction)}
        </td>
      )
    }
    if (fieldName == 'account_name') {
      return (
        <td key={index}>
          {transaction.account_name}
        </td>
      )
    }
  }
  

  render() {
    return (
      <tr>
        {this.props.fields.map( (field,index) => { return this.getCell(this.props.transaction, field, index)})}
        { this.getCategoryEditColumn() }
      </tr>
    )
  }
}

export default Transaction;

Transaction.propTypes = {
  transaction: PropTypes.shape({
    date: PropTypes.string,
    amount: PropTypes.float,
    category: PropTypes.string,
    account: PropTypes.string,
    original_description: PropTypes.string
  }),
  allowCategoryEdit: PropTypes.bool,
  optionList: PropTypes.arrayOf(PropTypes.object),  
  changeCategory: PropTypes.func,
  showCategory: PropTypes.bool, 
  fields: PropTypes.arrayOf(PropTypes.string),
  dateFormat: PropTypes.string,
  descriptionWidth: PropTypes.number
}

Transaction.defaultProps = {
  fields: ['date','description','account_name','category','amount'],
  dateFormat: 'DD MMM YY',
  descriptionWidth: 40
}
