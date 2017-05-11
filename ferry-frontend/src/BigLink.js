import React, { Component } from 'react';

import './BigText.css';
import './BigLink.css';

class BigLink extends Component {
  render() {
    return (
      <div className="BigText BigLink">
        <a href={this.props.href}> {this.props.text} </a>
      </div>
    );
  }
}

export default BigLink;
