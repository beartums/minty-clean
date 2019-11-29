import React from 'react';
import $ from 'jquery';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: this.props.id || 'sadOrphanedModal' };
  }

  onSaveButton = e => {
    e.persist();
    if (this.props.onSaveButton) {
      this.props.onSaveButton(e)
    }
    $(`#${this.state.id}`).modal('hide');
  }

  onCancelButton = e => {
    e.persist();
    if (this.props.onCancelButton) {
      this.props.onCancelButton(e);
    }
  }

  render() {
    return (
        <div className="modal fade" id={this.state.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              { !this.props.title ? '' : (
                <div className="modal-header">
                  <h5 className="modal-title">{this.props.title}</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}
              <div className="modal-body">
                {this.props.children}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.onCancelButton} data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.onSaveButton}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Modal;