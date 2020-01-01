/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

const Modal = ({
  title,
  message,
  id,
  buttons,
  children,
  isVisible,
  okButtonName,
  cancelButtonName,
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
      func({ event: e, button, payload });
    }
    isVisible = false;
  };

  const getButtons = (passedButtons, defaultButtons) => {
    const theseButtons = passedButtons || defaultButtons || [];
    return theseButtons.map((button) => (
      <button
        key={button.name}
        type="button"
        className={`btn ${button.classString}`}
        onClick={(e) => handleClick(e, button.handleClick, button)}
        data-dismiss={button.leaveOpen ? '' : 'modal'}
      >
        {button.name}
      </button>
    ));
  };

  const defaultButtons = (
    [
      { name: cancelButtonName, classString: 'btn-secondary', handleClick, leaveOpen: false, payload: { result: cancelButtonName } },
      { name: okButtonName, classString: 'btn-primary', handleClick, leaveOpen: false, payload: { result: okButtonName } },
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
            {children || message}
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
  message: PropTypes.string,
  id: PropTypes.string,
  okButtonName: PropTypes.string,
  cancelButtonName: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  isVisible: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  payload: PropTypes.any,
};

Modal.defaultProps = {
  title: undefined,
  message: undefined,
  id: 'aModal',
  okButtonName: 'Ok',
  cancelButtonName: 'Cancel',
  buttons: undefined,
  children: null,
  isVisible: false,
  payload: undefined,
};
