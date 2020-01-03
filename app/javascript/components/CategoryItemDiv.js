/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MdExpandMore, MdExpandLess, MdChangeHistory,
} from 'react-icons/md';

import TransactionRow from './TransactionRow';
import ChangeGroupDropdownItem from './ChangeGroupDropdownItem';

// import Category from '../models/Category';
import CategoryGroup from '../models/CategoryGroup';
import CollectionManager from '../models/CollectionManager';

const CategoryItemDiv = ({
  category,
  parentGroup,
  transactionCollection,
  groupCollection,
  createNewGroup,
  moveCategory,
}) => {
  const [showTransactions, setShowTransactions] = useState(false);

  const handleCreateNewGroup = () => {
    createNewGroup({ categoryName: category.name });
  };

  return (
    <div className="indent">
      {category.name}
        (
          {transactionCollection.get('byCategory', { category: category.name }).length}
        )
      &nbsp;
      <button
        className="btn btn-xs btn-hover"
          onClick={() => setShowTransactions(!showTransactions)}
      >
        {showTransactions ? <MdExpandLess /> : <MdExpandMore />}
      </button>
      &nbsp;
      <button className="btn btn-xs dropdown-toggle" title="Change groups" id="dropdownMenuButton" data-toggle="dropdown">
        <MdChangeHistory />
        Group
      </button>
      <div className="dropdown-menu">
        <ChangeGroupDropdownItem
          key="__NewGroup"
          handleClick={handleCreateNewGroup}
          group={{ id: '__newGroup', name: '<New>' }}
          categoryName={category.name}
          parentGroup={parentGroup}
        />
        { groupCollection.items.filter((group) => group.id >= 0 && group.id !== category.groupId)
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map((group) => (
                  <ChangeGroupDropdownItem
                    key={group.id}
                    handleClick={moveCategory}
                    group={group}
                    categoryName={category.name}
                    parentGroup={parentGroup}
                  />
          ))}
      </div>
      { showTransactions ? (
        <div className="indent">
          <table className="table table-condensed table-xs">
            <tbody>
              {transactionCollection.get('byCategory', category)
                .map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    descriptionWidth={30}
                    dateFormat="DD MMM"
                    fields={['date', 'description', 'accountName', 'amount']}
                  />
                ))}
            </tbody>
          </table>
        </div>
      ) : ''}
    </div>
  );
};

export default CategoryItemDiv;

CategoryItemDiv.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  category: PropTypes.object.isRequired,
  parentGroup: PropTypes.instanceOf(CategoryGroup).isRequired,
  groupCollection: PropTypes.instanceOf(CollectionManager).isRequired,
  transactionCollection: PropTypes.instanceOf(CollectionManager).isRequired,
  createNewGroup: PropTypes.func.isRequired,
  moveCategory: PropTypes.func.isRequired,
};
