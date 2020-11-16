/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';

const ModalButton = ({
  name,
  title,
  dataDismissName,
  icon,
  clickAction,
  classString,
  children,
}) => (
  <button
    type="button"
    className={`btn ${classString}`}
    onClick={clickAction}
    data-dismiss={dataDismissName}
    title={title}
  >
    {children || name || icon }
  </button>
);


export default ModalButton;

ModalButton.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  dataDismissName: PropTypes.string,
  icon: PropTypes.element,
  clickAction: PropTypes.func,
  classString: PropTypes.string,
  children: PropTypes.element,
};

ModalButton.defaultProps = {
  name: undefined,
  title: undefined,
  dataDismissName: 'modal',
  icon: undefined,
  classString: 'btn-secondary',
  clickAction: undefined,
  children: undefined,
};
