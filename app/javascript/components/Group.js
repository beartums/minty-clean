/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  FaCaretRight, FaCaretDown, FaTimes, FaEdit,
} from 'react-icons/fa';

import HoverButton from './HoverButton';

import CategoryItemDiv from './CategoryItemDiv';

const Group = ({
  group,
  groupCollection,
  transactionCollection,
  moveCategory,
  createNewGroup,
  deleteGroup,
  renameGroup,
}) => {
  const [isShowingCategories, setIsShowingCategories] = useState(false);

  const handleDeleteGroup = () => {
    deleteGroup(group);
  };

  const handleRenameGroup = () => {
    renameGroup({ oldGroup: group });
  };

  return (
    <div className="indent">
      <span style={+group.id < 0 ? { visibility: 'hidden' } : { visibility: 'visible' }}>
        <HoverButton clickHandler={handleDeleteGroup} iconComponent={<FaTimes />} />
        &nbsp;
        <HoverButton clickHandler={handleRenameGroup} iconComponent={<FaEdit />} />
        &nbsp;
      </span>
      <HoverButton
        clickHandler={() => setIsShowingCategories(!isShowingCategories)}
        iconComponent={isShowingCategories ? <FaCaretDown /> : <FaCaretRight />}
      />
      {`${group.name} (${group.categories.length})`}
      &nbsp;
      { isShowingCategories ? (
        <div className="indent">
          {
            group.categories.map((category) => (
              <CategoryItemDiv
                key={category.name}
                category={category}
                createNewGroup={createNewGroup}
                moveCategory={moveCategory}
                parentGroup={group}
                groupCollection={groupCollection}
                transactionCollection={transactionCollection}
              />
            ))
          }
        </div>
      ) : ''}
    </div>
  );
};

export default Group;
