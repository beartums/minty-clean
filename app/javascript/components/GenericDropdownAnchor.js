import React from 'react';
import { PropTypes } from 'prop-types';
import GenericDropdownItem from './GenericDropdownItem';

/* <GenericDropdownAnchor currentItem={this.props.transaction.category}
                    dropdownItems={this.props.categories}
                    handleClick={this.changeCategory}
                    /> */

class GenericDropdownAnchor extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (selectedItem) => {
    // tell calling prop the original item and the replacement item
    this.props.handleClick(this.props.item, selectedItem);
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
      <span>
        <button className="btn btn-xs dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown">
          { this.getItemDisplayString(this.props.currentItem, this.props.displayPropName) }
        </button>
        <div className="dropdown-menu">
          { 
            this.props.dropdownItems.map( item => {
              return (<GenericDropdownItem item={item} 
                            handleClick={this.handleClick} 
                            displayPropName={this.props.displayPropName}
                            />)
            })
          }
        </div>
      </span>
    )
  }
}

GenericDropdownAnchor.propTypes = {
  dropdownItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string,PropTypes.object])).isRequired,
  displayPropName: PropTypes.string,
  currentItem: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
  handleClick: PropTypes.func.isRequired,
  getDisplayElement: PropTypes.func
}

export default GenericDropdownAnchor;