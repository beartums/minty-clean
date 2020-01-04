/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

const ImportTransactionsButton = ({
  handleClick,
}) => {
  const inputStyle = { display: 'none' };

  return (
    <button className="btn file-field">
      <label className="btn btn-default btn-file">
        Import Transactions CSV
        <input
          type="file"
          style={inputStyle}
          onChange={handleClick}
        />
      </label>

    </button>
  );
};

export default ImportTransactionsButton;

ImportTransactionsButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
