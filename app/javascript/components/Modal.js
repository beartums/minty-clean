/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

const Modal = ({
  title,
  id,
  buttons,
  onSaveButton,
  onCancelButton,
  children,
  isVisible,
  // eslint-disable-next-line react/prop-types
  payload,
}) => {
  const [modalId] = useState(id);

  const show = () => {
    $(`#${modalId}`).modal('show');
  };

  const hide = () => {
    $(`#${modalId}`).modal('hide');
  };

  const handleClick = (e, func, button) => {
    e.persist();
    if (func) {
      func(e, button, payload);
    }
    isVisible = false;
  };

  const handleSaveButton = (e) => {
    e.persist();
    if (onSaveButton) {
      onSaveButton(e);
    }
    $(`#${modalId}`).modal('hide');
  };

  const handleCancelButton = (e) => {
    e.persist();
    if (onCancelButton) {
      onCancelButton(e);
    }
  };

  const getButtons = (passedButtons, defaultButtons) => {
    const theseButtons = passedButtons || defaultButtons || [];
    return theseButtons.map((button) => (
      <button
        key={button.name}
        type="button"
        className={`btn ${button.classString}`}
        onClick={(e) => handleClick(e, button.handleClick, button, payload)}
        data-dismiss={button.leaveOpen ? '' : 'modal'}
      >
        {button.name}
      </button>
    ));
  };

  const defaultButtons = (
    [
      { name: 'Cancel', classString: 'btn-secondary', handleClick: handleCancelButton, leaveOpen: false },
      { name: 'Save', classString: 'btn-primary', handleClick: handleSaveButton, leaveOpen: false },
    ]
  );

  useEffect(() => {
    if (isVisible) show();
    else hide();
  });

  return (
    <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          { !title ? '' : (
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            {getButtons(buttons, defaultButtons)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  onCancelButton: PropTypes.func,
  onSaveButton: PropTypes.func,
  buttons: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  isVisible: PropTypes.bool,
};

Modal.defaultProps = {
  title: undefined,
  id: 'aModal',
  onCancelButton: undefined,
  onSaveButton: undefined,
  buttons: undefined,
  children: null,
  isVisible: false,
};
