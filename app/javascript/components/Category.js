import React from 'react';
import Transaction from './Transaction';
import ChangeGroupDropdownItem from './ChangeGroupDropdownItem';

class Category extends React.Component {
  constructor(props) {
    // category, changeGroup (function), groups, parentGroup
    super(props);
    this.state = {
      showTransactions: false,
    }
  }
  createNewGroup = e => {
    this.props.createNewGroup(this.props.category.name, this.props.parentGroup);
  }

  render() {
    return (
      <div className="indent" key={this.props.category.name}>
        {this.props.category.name} ({this.props.category.transactions.length})
        &nbsp;
        <button className="btn btn-xs btn-hover" 
                onClick={() => this.setState({showTransactions: !this.state.showTransactions})}>
          {this.state.showTransactions ? "hide" : "show"}
        </button>
        &nbsp;
        <button className="btn btn-xs dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown">
          Select
        </button>
        <div className="dropdown-menu">
          <ChangeGroupDropdownItem key="__NewGroup" handleClick={this.createNewGroup} group={{id:'__newGroup', name: '<New>'}}
                                        categoryName={this.props.category.name} parentGroup={this.props.parentGroup} />
          { this.props.groups.map( (group,idx) => {
            return (
              <ChangeGroupDropdownItem key={idx} handleClick={this.props.changeGroup} 
                            group={group} categoryName={this.props.category.name} parentGroup={this.props.parentGroup} />
            )
          })}
        </div>
        { this.state.showTransactions ? (
          <div className="indent">
            <table className="table table-condensed table-xs">
              <tbody>
                {this.props.category.transactions.map( transaction => {
                  return <Transaction key={transaction.id} transaction={transaction} />
                })}
              </tbody>
            </table>
          </div>
          ) : ''
        }
      </div>
    )
  }
}

export default Category;