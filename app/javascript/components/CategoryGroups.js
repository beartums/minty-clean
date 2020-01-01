/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-new */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
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

class CategoryGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxTransactionDate: this.props.maxDate,
      minTransactionDate: this.props.minDate,
      groups: this.props.groupCollection.items,
      modal: {},
      groupNamePayload: null,
      summaryTransactions: null,
    };
  }

  showDeleteGroupModal = (group) => {
    this.setState({
      modal: {
        payload: { group },
        title: 'Delete Group!',
        isVisible: true,
        buttons: [
          { name: 'Cancel', classString: 'btn-secondary' },
          { name: 'DELETE!', classString: 'btn-primary', handleClick: this.onDeleteGroupModalAction },
        ],
        children: (
          <span>
            If you click 'DELETE!', the group will be deleted for good.
             this action is NOT reversible.  All of the assigned categories WILL
             be retained, but marked as Unassigned.
          </span>
        ),
      },
    });
  }

  showEditGroupNameModal = (params) => {
    const { categoryName, oldGroup } = params;
    this.setState({
      modalInputValue: oldGroup ? oldGroup.name : '',
      modal: {
        payload: { categoryName, oldGroup },
        isVisible: true,
        title: oldGroup ? 'Edit Group Name' : 'Create New Group',
        buttons: [
          { name: 'Cancel', classString: 'btn-secondary' },
          { name: 'Save', classString: 'btn-primary', handleClick: this.onEditGroupNameAction },
        ],
        children: (
          <span>
            Enter the name for your new group:
            <input
              value={this.state.modalInputValue}
              onChange={(e) => this.setState({ modalInputValue: e.target.value })}
              className="form-control"
              type="text"
            />
          </span>
        ),
      },
    });
  }

  onDeleteGroupModalAction = ({ payload }) => {
    const { group } = payload;
    RestClient.deleteGroup(group)
      .then((result) => {
        // eslint-disable-next-line eqeqeq
        if (result.status == 200) {
          this.dropGroup(group);
        }
      })
      .finally(() => {
        this.setState({
          modal: { isVisible: false },
        });
      });
  }

  onEditGroupNameAction = ({ payload }) => {
    const groupName = this.state.modalInputValue;
    const { oldGroup, categoryName } = payload;

    let promise;

    if (oldGroup) {
      promise = this.renameGroup(groupName, oldGroup)
        .then(() => {
          oldGroup.name = groupName;
        });
    } else {
      promise = this.saveNewGroup(groupName)
        .then((result) => {
          const group = new CategoryGroup({ id: result.id, name: result.name });
          this.moveCategory(categoryName, group, oldGroup);
        });
    }
    promise.catch((err) => console.log('onSavemodalAction', err))
      .finally(() => {
        this.setState({
          modal: { isVisible: false },
        });
      });
  }

  saveNewGroup = (groupName) => RestClient.createGroup({ name: groupName })

  renameGroup = (groupName, group) => RestClient.updateGroup(group, groupName)

  moveCategory = (categoryName, newGroup) => {
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
          createNewGroup={this.showEditGroupNameModal}
          moveCategory={this.moveCategory}
          deleteGroup={this.showDeleteGroupModal}
          renameGroup={this.showEditGroupNameModal}
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
          id="GroupModal"
          buttons={this.state.modal.buttons}
          payload={this.state.modal.payload}
          isVisible={this.state.modal.isVisible}
          title={this.state.modal.title}
        >
          {this.state.modal.children}
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
