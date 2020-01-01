/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import CategoryGroup from '../models/CategoryGroup';

const ChangeGroupDropdownItem = ({
  categoryName,
  group,
  parentGroup,
  handleClick,
}) => {
  const onClick = () => {
    handleClick(categoryName, group, parentGroup);
  };

  return (
    <a className="dropdown-item" onClick={onClick}>
      {group.name}
    </a>
  );
};

export default ChangeGroupDropdownItem;

ChangeGroupDropdownItem.propTypes = {
  categoryName: PropTypes.string.isRequired,
  group: PropTypes.instanceOf(CategoryGroup).isRequired,
  parentGroup: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(CategoryGroup),
  ]),
  handleClick: PropTypes.func.isRequired,
};

ChangeGroupDropdownItem.defaultProps = {
  parentGroup: undefined,
};
