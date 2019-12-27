import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import DataService from '../services/dataService';
import { Settings, KEYS } from '../services/settings';

import TransactionSummaryTable from './TransactionSummaryTable';
import TransactionRow from './TransactionRow';
import Group from './Group'
import Modal from './Modal';

var GROUP_NAME_DIALOG = {
  METHODS: {
    CREATE: 'create',
    RENAME: 'rename'
  },
  MODAL_ID: 'groupNameModalId',
  INPUT_ID: 'groupNameInputId'
}

var GROUP_DELETE_DIALOG = {
  MODAL_ID: 'groupDeleteModalId'
}

class CategoryGroups extends React.Component {
  constructor(props) {
    super(props);

    //let minMax = this.getDateMinMax(this.props.transactions)
    this.state = {
      maxTransactionDate: this.props.maxDate,
      minTransactionDate: this.props.minDate,
      groups: this.props.groupCollection.items,
      memberships: this.props.categoryCollection.items,
      categoryIndex: this.props.categoryCollection,
      categories: this.props.categories,
      groupNamePayload: null,
      summaryTransactions: null
    }
    
  }

  changeGroup = (categoryName, newGroup, oldGroup) => {
    let newId = newGroup.id, oldId = oldGroup.id;
    
    let categoryMembership = this.state.memberships[categoryName];
    let url, method
    if (!categoryMembership) {
      url = 'api/v1/category_group_memberships';
      method = 'POST';
    } else {
      url = 'api/v1/category_group_memberships/' + categoryMembership.id;
      method = 'PATCH'
    }
    categoryMembership = {
      category: categoryName,
      category_group_id: newId
    }
    fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'category_group_membership': categoryMembership})
    }).then( result => {
      if (result.status !== 200) throw new Error(result.msg);
      return result.json();
    }).catch( e => console.log(e))
      .then( result => {
      let categoryIndex = this.state.categoryIndex;
      // remove from current group
      let currentGroup = categoryIndex[oldId];
      let category;
      if (currentGroup) {
        category = currentGroup.categories.find( category => category.name === categoryName);
        if (category) {
          let idx = currentGroup.categories.indexOf(category);
          currentGroup.categories.splice(idx,1)
        }
      }
      // add to new group
      let futureGroup = categoryIndex[newId];
      if (!futureGroup) {
        futureGroup = {
          id: newId,
          name: this.state.groups[newId].name,
          categories: []
        }
        categoryIndex[newId] = futureGroup
      }
      futureGroup.categories.push(category);
      this.setState({categoryIndex: categoryIndex})
    })
  }

  showCreateNewGroupModal = (categoryName, oldGroup) => {
    // Params are needed so that the category can be moved to the 
    // newly-created group.
    this.setState({groupNamePayload: {
      categoryName: categoryName,
      oldGroup: oldGroup,
      method: GROUP_NAME_DIALOG.METHODS.CREATE
    }})
    $(`#${GROUP_NAME_DIALOG.INPUT_ID}`).val('');
    $(`#${GROUP_NAME_DIALOG.MODAL_ID}`).modal('show');
  }
  
  showRenameGroupModal = group => {
    //payload.method = 'Rename'
    this.setState({groupNamePayload: {
      categoryName: null,
      oldGroup: group,
      method: GROUP_NAME_DIALOG.METHODS.RENAME
    }})
    $(`#${GROUP_NAME_DIALOG.INPUT_ID}`).val(group.name);
    $(`#${GROUP_NAME_DIALOG.MODAL_ID}`).modal('show');
  }
  
  showDeleteGroupModal = group => {
    this.setState({groupToDelete: group})
    $(`#${GROUP_DELETE_DIALOG.MODAL_ID}`).modal('show');
  }

  closeGroupNameDialog = () => {
    $(`#${GROUP_NAME_DIALOG.MODAL_ID}`).modal('hide');
  }

  renameGroup = (groupName, group) => {
    return fetch(`/api/v1/category_groups/${group.id}`, {
      method:'PATCH',
      body: JSON.stringify({'category_group': {
        'name': groupName
      }}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response);
      return response;
    });
  }

  onSaveGroupNameDialogAction = () => {
    let groupName = $(`#${GROUP_NAME_DIALOG.INPUT_ID}`).val();
    let oldGroup = this.state.groupNamePayload.oldGroup;
    let categoryName = this.state.groupNamePayload.categoryName;
    let promise;

    if (this.state.groupNamePayload.method===GROUP_NAME_DIALOG.METHODS.RENAME) {
      promise = this.renameGroup(groupName, oldGroup)
        .then(result => {
          if (result.status !== 200) throw new Error(result.msg);
          return result.json()
        })
        .then(result => {
          let groupId = oldGroup.id
          let groups = this.state.groups;
          let categoryIndex = this.state.categoryIndex;
          
          groups[groupId].name = groupName;
          categoryIndex[groupId].name = groupName;

          this.setState({
            groups: groups,
            categoryIndex: categoryIndex
          })
        });
    } else {
      promise = this.saveNewGroup(groupName)
        .then(result => {
          if (result.status!==200) throw new Error(result.msg);
          return result.json()
        })
        .then(result => {
          let group = { id: result.id, name: result.name};
          let groups = this.state.groups;
      
          groups[group.id] = group
          this.setState({groups: groups});
          this.changeGroup(categoryName, group, oldGroup);  
        });
    }
    promise.catch(e => console.log("onSaveGroupNameDialogAction",e))
            .finally(() => this.closeGroupNameDialog());
  }

  saveNewGroup = groupName => {
    let group = {'name': groupName};
    let body = JSON.stringify({'category_group': group});
    console.log(body,group);
    return fetch('/api/v1/category_groups', {
      method:'POST',
      body:body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  dropGroup = (group,newGroup) => {
    newGroup = newGroup || this.state.categoryIndex['-2'];
    newGroup.categories = newGroup.categories.concat(group.categories);
    newGroup.categories.sort((a,b) => {a<b ? -1 : 1});
    let groups = this.state.groups;
    delete groups[group.id];
    let categoryIndex = this.state.categoryIndex
    delete categoryIndex[group.id]
    this.setState({groups: groups, categoryIndex: categoryIndex});
  }

  deleteGroup = group => {
    group = group || this.state.groupToDelete;
    fetch(`/api/v1/category_groups/${group.id}`, {
      method: 'DELETE'
    }).then(result => {
      if (result.status===200) {
        this.dropGroup(group);
      }
    })
  }

  showTransactions = (transactions) => {
    this.setState({summaryTransactions:transactions})
  }

  hideTransactions = (group) => {
    this.setState({summaryTransactions: false})
  }

  getGroupListDiv = (groups) => {
    return (
      groups.map( group => <Group key={group.name} 
                                        createNewGroup={this.showCreateNewGroupModal}
                                        changeGroup={this.changeGroup}
                                        deleteGroup={this.showDeleteGroupModal}
                                        renameGroup={this.showRenameGroupModal}
                                        group={group} 
                                        groups={Object.values(this.state.groups)} />) 
    )
  }

  getTransactionDetailDiv = () => {
    return (
      <table width="100%" className="table table-condensed table-xs">
        <tbody>
          { this.state.summaryTransactions.map( t =>  {
            return (
              <TransactionRow key={t.id} transaction={t} 
                dateFormat="DD MMM"
                descriptionWidth={35}
              /> 
            )
          })}
        </tbody>
      </table>
    )
  }
  render = () => {
    let groups = Object.values(this.state.groups)
        .sort((a,b) => a.name<b.name ? -1 : 1)
        .filter(group => group.categories.length > 0);
    //let cgs = groups.map( group => new CategoryGroup(group))

    return (
      <span>
        <Modal id={GROUP_NAME_DIALOG.MODAL_ID} 
            onSaveButton={this.onSaveGroupNameDialogAction} 
            onCancelButton={this.onCancelGroupNameDialog} 
            title="New Group Name">
          <input id={GROUP_NAME_DIALOG.INPUT_ID} className="form-control" type="text" />
        </Modal>
        <Modal id={GROUP_DELETE_DIALOG.MODAL_ID} 
            onSaveButton={this.deleteGroup} 
            onCancelButton={this.onCancelDeleteDialog} 
            title="Delete Group">
            If you click 'Save', the group will be deleted for good.
            this action is NOT reversible.  All of the assigned categories will be moved to the Unassigned group.
        </Modal>
        <div className="col-12">
          <div className="row">
            <div className="col-6">
                <TransactionSummaryTable groups={groups} 
                                transactions={this.props.transactions}
                                minDate={this.state.minTransactionDate}
                                maxDate={this.state.maxTransactionDate}
                                showTransactions={this.showTransactions}
                                hideTransactions={this.hideTransactions} />
            </div>
            <div className="col-6">
            { this.state.summaryTransactions ? this.getTransactionDetailDiv() : this.getGroupListDiv(groups)}
            </div>
          </div>
        </div>
      </span>
    )
  }
}

export default CategoryGroups;

CategoryGroups.propTypes = {
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  transactions: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    amount: PropTypes.float,
    category: PropTypes.string,
    account: PropTypes.string,
    original_description: PropTypes.string
  }))
}