/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { PropTypes } from 'prop-types';

class GenericDropdownItem extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.handleClick(this.props.item);
  }

  getItemDisplayString = (item, propName) => {
    item = item || this.props.item;
    propName = propName || this.props.displayPropName;
    return typeof item === 'string' ? item : item[propName];
  }


  render() {
    return (
      <a className="dropdown-item" onClick={this.handleClick}>
        {this.getItemDisplayString(this.props.item, this.props.displayPropName)}
      </a>
    );
  }
}

GenericDropdownItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  displayPropName: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  getDisplayElement: PropTypes.func,
};

export default GenericDropdownItem;

GenericDropdownItem.defaultProps = {
  displayPropName: undefined,
  getDisplayElement: undefined,
};
