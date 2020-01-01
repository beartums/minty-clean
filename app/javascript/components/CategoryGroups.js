/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-new */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
// import _ from 'lodash';

import RestClient from '../services/RestClient';
// import * as DS from '../services/DataService';

import TransactionSummaryTable from './TransactionSummaryTable';
import TransactionRow from './TransactionRow';
import Group from './Group';
import Modal from './Modal';

import Category from '../models/Category';
import CategoryGroup from '../models/CategoryGroup';

const GROUP_NAME_DIALOG = {
  METHODS: {
    CREATE: 'create',
    RENAME: 'rename',
  },
  MODAL_ID: 'groupNameModalId',
  INPUT_ID: 'groupNameInputId',
};

const GROUP_DELETE_DIALOG = {
  MODAL_ID: 'groupDeleteModalId',
};

class CategoryGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxTransactionDate: this.props.maxDate,
      minTransactionDate: this.props.minDate,
      groups: this.props.groupCollection.items,
      deleteModal: {},
      groupNameModal: {},
      groupNamePayload: null,
      summaryTransactions: null,
    };
  }

  onDeleteGroupModalAction = (e, button, payload) => {
    const group = payload;
    RestClient.deleteGroup(group)
      .then((result) => {
        // eslint-disable-next-line eqeqeq
        if (result.status == 200) {
          this.dropGroup(group);
        }
      })
      .finally(() => {
        this.setState({
          deleteModal: { isVisible: false },
        });
      });
  }

  onGroupNameModalAction = (e, button, payload) => {
    const groupName = payload.nameInput.val();
    const { oldGroup, categoryName } = payload;

    let promise;

    if (oldGroup) {
      promise = this.renameGroup(groupName, oldGroup)
        .catch((err) => console.log(err))
        .then(() => {
          oldGroup.name = groupName;
        });
    } else {
      promise = this.saveNewGroup(groupName)
        .catch((err) => console.log(err))
        .then((result) => {
          const group = new CategoryGroup({ id: result.id, name: result.name });
          this.changeGroup(categoryName, group, oldGroup);
        });
    }
    promise.catch((err) => console.log('onSavegroupNameModalAction', err))
      .finally(() => {
        this.setState({
          groupNameModal: { isVisible: false },
        });
      });
  }

  saveNewGroup = (groupName) => RestClient.createGroup({ name: groupName })

  renameGroup = (groupName, group) => RestClient.updateGroup(group, groupName)

  changeGroup = (categoryName, newGroup) => {
    const newId = newGroup.id;
    let category = this.props.categoryCollection.get('byName', { name: categoryName });
    if (!category) category = { category: categoryName, categoryGroupId: newId };

    RestClient.upsertCategory(category, newId)
      .catch((e) => console.log(e))
      .then((result) => {
        if (category.id) {
          category.groupId = newId;
        } else {
          new Category(result);
        }
        this.setState({ categoryIndex: Category.collection });
      });
  }

  dropGroup = (group) => {
    const cats = Category.collection.get('byGroupId', { groupId: group.id });
    cats.forEach((cat) => cat.collection.remove(cat));
    if (group.id >= 0) CategoryGroup.collection.remove(group);
    this.setState({ groups: this.state.groups });
  }

  showDeleteGroupModal = (group) => {
    this.setState({
      deleteModal: {
        payload: group,
        isVisible: true,
      },
    });
    // $(`#${GROUP_DELETE_DIALOG.MODAL_ID}`).modal('show');
  }

  showGroupNameModal = (params) => {
    const { categoryName, oldGroup } = params;
    this.setState({
      groupNameModal: {
        payload: {
          categoryName, oldGroup, nameInput: $(`#${GROUP_NAME_DIALOG.INPUT_ID}`),
        },
        isVisible: true,
        buttons: [
          { name: 'Cancel', classString: 'btn-secondary' },
          { name: 'Save', classString: 'btn-primary', handleClick: this.onGroupNameModalAction },
        ],
      },
    });
    $(`#${GROUP_NAME_DIALOG.INPUT_ID}`).val(oldGroup ? oldGroup.name : '');
  }

  showTransactions = (transactions) => {
    this.setState({ summaryTransactions: transactions });
  }

  hideTransactions = () => {
    this.setState({ summaryTransactions: false });
  }

  getGroupListDiv = (groups) => (
    groups.filter((group) => group.categories.length > 0)
      .map((group) => (
        <Group
          key={group.name}
          createNewGroup={this.showGroupNameModal}
          changeGroup={this.changeGroup}
          deleteGroup={this.showDeleteGroupModal}
          renameGroup={this.showGroupNameModal}
          group={group}
          groupCollection={this.props.groupCollection}
          transactionCollection={this.props.transactionCollection}
        />
      ))
  )

  getTransactionDetailDiv = () => (
    <table width="100%" className="table table-condensed table-xs">
      <tbody>
        { this.state.summaryTransactions.map((t) => (
          <TransactionRow
            key={t.id}
            transaction={t}
            dateFormat="DD MMM"
            descriptionWidth={35}
          />
        ))}
      </tbody>
    </table>
  )

  render = () => {
    const groups = Object.values(this.state.groups)
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .filter((group) => group.categories.length > 0);
    // let cgs = groups.map( group => new CategoryGroup(group))

    return (
      <span>
        <Modal
          id={GROUP_NAME_DIALOG.MODAL_ID}
          buttons={this.state.groupNameModal.buttons}
          payload={this.state.groupNameModal.payload}
          isVisible={this.state.groupNameModal.isVisible}
          title="New Group Name"
        >
          <input id={GROUP_NAME_DIALOG.INPUT_ID} className="form-control" type="text" />
        </Modal>
        <Modal
          id={GROUP_DELETE_DIALOG.MODAL_ID}
          title="Delete Group"
          buttons={
            [
              { name: 'Cancel', classString: 'btn-secondary' },
              { name: 'DELETE!', classString: 'btn-primary', handleClick: this.onDeleteGroupModalAction },
            ]
          }
          payload={this.state.deleteModal.payload}
          isVisible={this.state.deleteModal.isVisible}
        >
            If you click 'Save', the group will be deleted for good.
             this action is NOT reversible.  All of the assigned categories will
             be moved to the Unassigned group.
        </Modal>
        <div className="col-12">
          <div className="row">
            <div className="col-6">
              <TransactionSummaryTable
                groups={groups}
                periods={this.props.periods}
                transactions={this.props.transactions}
                minDate={this.state.minTransactionDate}
                maxDate={this.state.maxTransactionDate}
                showTransactions={this.showTransactions}
                hideTransactions={this.hideTransactions}
              />
            </div>
            <div className="col-6">
              { this.state.summaryTransactions
                ? this.getTransactionDetailDiv()
                : this.getGroupListDiv(groups)}
            </div>
          </div>
        </div>
      </span>
    );
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
    original_description: PropTypes.string,
  })),
};
