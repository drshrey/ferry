import React, { Component } from 'react';

import './SmallLink.css';

class SmallLink extends Component {
  render() {
    return (
      <div className="SmallLink">
        <a href={this.props.href}> {this.props.text} </a>
      </div>
    );
  }
}

export default SmallLink;
