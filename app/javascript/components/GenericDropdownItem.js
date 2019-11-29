import React from 'react';
import { PropTypes } from 'prop-types';

class GenericDropdownItem extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.handleClick(this.props.item);
  }

  getItemDisplayString = (item, propName) => {
    item = item || this.props.item;
    propName = propName || this.props.displayPropName;
    if (typeof(item) === 'string') {
      return item;
    } else {
      return item[this.props.displayPropName];
    }
  }


  render() {
    return (
      <a className="dropdown-item" onClick={this.handleClick} >
        {this.getItemDisplayString(this.props.item, this.props.displayPropName)}
      </a>
    )
  }
}

GenericDropdownItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
  displayPropName: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  getDisplayElement: PropTypes.func
}

export default GenericDropdownItem;



