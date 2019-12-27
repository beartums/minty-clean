import React from 'react';
import TransactionRow from './TransactionRow';
import ChangeGroupDropdownItem from './ChangeGroupDropdownItem';

class Category extends React.Component {
  constructor(props) {
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
        {this.props.category.name} ({this.props.transactionCollection.get('byCategory',this.props.category).length})
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
          { this.props.groupCollection.items.sort( (a,b) => a.name < b.name ? -1 : 1 )
            .map( (group,idx) => {
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
                {this.props.transactionCollection.get('byCategory', this.props.category).map( transaction => {
                  return <TransactionRow key={transaction.id} 
                                      transaction={transaction}
                                      descriptionWidth={30}
                                      dateFormat="DD MMM"
                                      fields={['date', 'description', 'accountName', 'amount']} />
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