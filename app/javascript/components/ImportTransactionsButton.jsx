/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

const ImportTransactionsButton = ({
  buttonText,
  handleClick,
}) => {
  const inputStyle = { display: 'none' };

  return (
    <button
      className="btn file-field"
      type="button"
    >
      <label className="btn btn-default btn-file">
        {buttonText}
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
  buttonText: PropTypes.string,
};

ImportTransactionsButton.defaultProps = {
  buttonText: 'Import Transactions',
};
