import React from "react";
import { getSignedAmount } from '../services/transactionService';
import GenericDropdownAnchor from './GenericDropdownAnchor';
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
        return <td>{this.props.transaction.category}</td>
    } else if (this.state.isBeingEdited) {
      return (
        <td>
          <select id={`${this.props.transaction.category}-category-select`}
            value={this.props.transaction.category} onChange={this.changeCategory}>
            {this.props.optionList}
          </select>
        </td>
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
  

  render() {
    return (
      <tr>
          <td>{moment(this.props.transaction.date).format('DD MMM YY')}</td>
          <td width="40%">{this.props.transaction.description}</td>
          <td className="text-right">{numeral(getSignedAmount(this.props.transaction)).format('$0.00')}</td>
          <td>{this.props.transaction.account_name}</td>
          { this.getCategoryColumn() }
          { this.getCategoryEditColumn() }
      </tr>
    )
  }
}

export default Transaction;
