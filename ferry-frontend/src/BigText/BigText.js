import React, { Component } from 'react';

import './BigText.css';

class BigText extends Component {
  render() {
    return (
      <div style={this.props.style} className="BigText">
        {this.props.text}
      </div>
    );
  }
}

export default BigText;
