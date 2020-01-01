/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { PropTypes } from 'prop-types';

const GenericDropdownItem = ({
  item,
  displayPropName,
  clickHandler,
  displayElement,
  displayElementFactory,
}) => {
  const getItemDisplayString = () => (typeof item === 'string' ? item : item[displayPropName]);

  const getDisplayElement = () => {
    if (displayElement) return displayElement;
    if (displayElementFactory) return displayElementFactory(item, displayPropName);
    return getItemDisplayString();
  };

  return (
    <a className="dropdown-item" onClick={() => clickHandler(item)}>
      {getDisplayElement()}
    </a>
  );
};

export default GenericDropdownItem;

GenericDropdownItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  displayPropName: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  displayElementFactory: PropTypes.func,
  displayElement: PropTypes.element,
};

GenericDropdownItem.defaultProps = {
  displayPropName: undefined,
  displayElementFactory: undefined,
  displayElement: undefined,
};
