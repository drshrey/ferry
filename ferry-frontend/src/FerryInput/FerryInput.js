import React, { Component, PropTypes } from 'react';

import './FerryInput.css';

class FerryInput extends Component {
  render() {
    return (
      <div>
          <input onChange={this.props.onChange} className="FerryInput" type={this.props.type} placeholder={this.props.placeholder} />
      </div>
    );
  }
}

FerryInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string
}

export default FerryInput;
