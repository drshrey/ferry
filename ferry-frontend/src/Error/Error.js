import React, { Component } from 'react';

import './Error.css';
import '../index.css';

class Error extends Component {
  render() {
    return (
      <div className="Error">
        { this.props.msg }
      </div>
    );
  }
}

export default Error;
