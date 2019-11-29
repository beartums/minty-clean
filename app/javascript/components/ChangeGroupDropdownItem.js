import React from 'react'

class ChangeGroupDropdownItem extends React.Component {
  constructor(props) {
    super(props);
    // need: group, handleClick, categoryName, parentGroup
  }

  handleClick = e => {
    this.props.handleClick(this.props.categoryName, this.props.group, this.props.parentGroup);
  }

  render() {
    return (
      <a className="dropdown-item" onClick={this.handleClick} >
        {this.props.group.name}
      </a>
    )
  }
}

export default ChangeGroupDropdownItem;