import React from "react"
import PropTypes from "prop-types"
class ImportTransactionsForm extends React.Component {

  inputStyle = {display: "none"}
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className="btn file-field">

        <label className="btn btn-default btn-file">
            Import Transactions CSV 
            <input type="file" 
                    style={this.inputStyle} 
                    onChange={this.props.handleClick} />
        </label>
  

      </button>
    )
  }
}

export default ImportTransactionsForm
