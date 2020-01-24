/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/jsx-indent */
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
import moment from 'moment';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
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
      transPeriod: null,
      transGroups: null,
      modal: {},
      groupNamePayload: null,
      summaryTransactions: null,
    };
  }

  showDeleteGroupModal = (group) => {
    this.setState({
      modal: {
        payload: { group },
        title: `Delete Group: ${group.name}`,
        isVisible: true,
        buttons: [
          { name: 'Cancel', classString: 'btn-secondary' },
          { name: 'DELETE!', classString: 'btn-primary', handleClick: this.onDeleteGroupModalAction },
        ],
        children: (
          <span>
            If you click 'DELETE!', <strong>{group.name}</strong> will be deleted for good.
             this action is NOT reversible.  All of the assigned categories WILL
             be retained, but marked as Unassigned.
          </span>
        ),
      },
    });
  }

  getEditChild = () => (
    <span>
      Enter/edit Group Name:
      <input
        value={this.state.modalInputValue}
        onChange={(e) => this.setState({ modalInputValue: e.target.value })}
        className="form-control"
        type="text"
      />
    </span>
  )

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
        children: null,
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

  showTransactions = (period, group, transactions) => {
    this.setState({ transPeriod: period, transGroup: group, summaryTransactions: transactions });
  }

  hideTransactions = () => {
    this.setState({ summaryTransactions: false });
  }

  handlePanelSizeChange = (secondarySize) => {
    const el = document.getElementById('splitter-wrapper');
    const primarySize = el.clientWidth - secondarySize - 2;
    return primarySize;
    // console.log(el.clientWidth, size, el.clientWidth - size);
  }

  getGroupListDiv = (groups) => (
    <span>
      <h3>Group Membership</h3>
      {
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
      }
    </span>
  )

  getTransactionDetailDiv = (period, group) => (
    <span>
      <h4>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <strong>{group.name}</strong> from {moment(period.startDate).format('D MMM')} to {moment(period.endDate).format('D MMM')}
      </h4>
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
    </span>
  )

  render = () => {
    const groups = Object.values(this.state.groups)
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .filter((group) => group.categories.length > 0);

    return (
      <span>
        <Modal
          id="GroupModal"
          buttons={this.state.modal.buttons}
          payload={this.state.modal.payload}
          isVisible={this.state.modal.isVisible}
          title={this.state.modal.title}
        >
          {this.state.modal.children || this.getEditChild()}
        </Modal>
        <div id="splitter-wrapper">
          <SplitterLayout
            id="splitter-panel"
            customClassName="height-90 white-splitter splitter-1"
            primaryMinSize={310}
            secondaryMinSize={300}
            onSecondaryPaneSizeChange={this.handlePanelSizeChange}
          >
            <div className="card" height="100%">
              <div className="card-body">
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
            </div>
            <div className="card" height="100%">
              <div className="card-body">
                { this.state.summaryTransactions
                  ? this.getTransactionDetailDiv(this.state.transPeriod, this.state.transGroup)
                  : this.getGroupListDiv(groups)}
              </div>
            </div>
          </SplitterLayout>
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
