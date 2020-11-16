
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';

import { FaQuestion } from 'react-icons/fa';

function HoverButton({ iconComponent, clickHandler, title }) {
  return (
    <a className="hover-button" onClick={clickHandler} title={title}>
      {iconComponent}
    </a>
  );
}

export default HoverButton;

HoverButton.propTypes = {
  iconComponent: PropTypes.element,
  clickHandler: PropTypes.func.isRequired,
  title: PropTypes.string,
};

HoverButton.defaultProps = {
  iconComponent: <FaQuestion />,
  title: '',
};
