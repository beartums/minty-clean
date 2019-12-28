import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import DataService from '../services/dataService';
import { Settings, KEYS } from '../services/settings';

import TransactionSummaryTable from './TransactionSummaryTable';
import TransactionRow from './TransactionRow';
import Group from './Group'
import Modal from './Modal';

import Transaction  from '../models/Transaction';
import Category from '../models/Category';
import CategoryGroup from '../models/CategoryGroup';

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
    
    let category = this.props.categoryCollection.get('byName', {name: categoryName});
    if (!category) category = {category: categoryName, categoryGroupId: newId}

    DataService.upsertCategory(category, newId)
      .catch( e => console.log(e))
      .then( result => {
        if (category.id) {
          category.groupId = newId;
        } else {
          new Category(result);
        }
        this.setState( { categoryIndex: Category.collection })
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
          oldGroup.name = groupName

          this.setState({ groups: this.state.groups });
        });
    } else {
      promise = this.saveNewGroup(groupName)
        .then(result => {
          if (result.status!==200) throw new Error(result.msg);
          return result.json()
        })
        .then(result => {
          let group = new CategoryGroup({ id: result.id, name: result.name});

          this.setState({groups: this.state.groups});
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

  dropGroup = (group) => {
    let cats = Category.collection.get('byGroupId', {groupId: group.id})
    cats.forEach( cat => cat.collection.remove(cat));
    if (group.id >= 0) CategoryGroup.collection.remove(group);
    this.setState({ groups: this.state.groups });
  }

  deleteGroup = () => {
    let group = this.state.groupToDelete;
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
          groups.filter( group => group.categories.length > 0)
                .map( group => <Group key={group.name} 
                                        createNewGroup={this.showCreateNewGroupModal}
                                        changeGroup={this.changeGroup}
                                        deleteGroup={this.showDeleteGroupModal}
                                        renameGroup={this.showRenameGroupModal}
                                        group={group} 
                                        groupCollection={this.props.groupCollection}
                                        transactionCollection={this.props.transactionCollection} />
          )
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