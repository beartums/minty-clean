import React from 'react';
import Category from './Category';
import { FaCaretRight, FaCaretDown, FaTimes, FaEdit } from 'react-icons/fa'

const invisible = { visibility: 'hidden'}
class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategories: false
    }
  }

  deleteGroup = () => {
    this.props.deleteGroup(this.props.group);
  }
  renameGroup = () => {
    this.props.renameGroup(this.props.group);
  }

  render() {
    return (
      <div className="indent">
        <span style={+this.props.group.id < 0 ? {visibility:'hidden'} : {visibility: 'visible'}}>
          <a className="hover-button" onClick={this.deleteGroup}>
            <FaTimes />
          </a>
          &nbsp;
          <a className="hover-button" onClick={this.renameGroup}>
            <FaEdit />
          </a>
          &nbsp;
        </span>          
        <a className="hover-button" 
          onClick={() => this.setState({showCategories: !this.state.showCategories})}>
          {this.state.showCategories ? <FaCaretDown /> : <FaCaretRight />}
        </a>
      { this.props.group.name } ({ this.props.group.categories.length }) 
        &nbsp;
        { this.state.showCategories ? (
            <div className="indent">
              {
                this.props.group.categories.map( (category) => {
                 return (
                    <Category key={category.name} category={category} 
                              createNewGroup={this.props.createNewGroup}
                              groups={this.props.groups} changeGroup={this.props.changeGroup} 
                              parentGroup={this.props.group}/> 
                 )
                })
              }
            </div>
          ) : ''
        }
      </div>
    )
  }
}

export default Group;