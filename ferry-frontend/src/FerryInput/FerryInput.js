import React, { Component } from 'react';

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

export default FerryInput;
