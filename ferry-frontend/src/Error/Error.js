import React, { Component } from 'react';

import './Error.css';
import '../index.css';

class Error extends Component {
  constructor(props){
    super(props)
  }

  render() {
    let errorClass = "Error " + this.props.className
    return (
      <div className={errorClass}>
        { this.props.msg }
      </div>
    );
  }
}

export default Error;
