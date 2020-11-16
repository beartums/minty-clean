/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { PropTypes } from 'prop-types';
import GenericDropdownItem from './GenericDropdownItem';

/* <GenericDropdownAnchor currentItem={transaction.category}
                    dropdownItems={categories}
                    handleClick={this.changeCategory}
                    /> */

const GenericDropdownAnchor = ({
  item,
  displayPropName,
  dropdownItems,
  ddiDisplayPropName,
  ddiDisplayElementFactory,
  clickHandler,
  displayElementFactory,
  displayElement,
}) => {
  const handleClick = (selectedItem) => {
    // tell calling prop the original item and the replacement item
    clickHandler(item, selectedItem);
  };

  const getItemDisplayString = () => {
    if (typeof item === 'string') return item;
    return item[displayPropName];
  };

  return (
    <span>
      <button className="btn btn-xs dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown">
        { getItemDisplayString(item, displayPropName) }
      </button>
      <div className="dropdown-menu">
        {
          dropdownItems.map((ddi) => (
            <GenericDropdownItem
              item={ddi}
              handleClick={handleClick}
              displayPropName={ddiDisplayPropName || displayPropName}
              displayElementFactory={ddiDisplayElementFactory}
            />
          ))
        }
      </div>
    </span>
  );
};

GenericDropdownAnchor.propTypes = {
  dropdownItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  ).isRequired,
  displayPropName: PropTypes.string,
  item: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  handleClick: PropTypes.func.isRequired,
  displayElementFactory: PropTypes.func,
};

GenericDropdownAnchor.defaultProps = {
  displayPropName: null,
  displayElementFactory: null,
};

export default GenericDropdownAnchor;
