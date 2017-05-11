import React, { Component } from 'react';

import './BigText.css';

class BigText extends Component {
  render() {
    return (
      <div className="BigText">
        {this.props.text}
      </div>
    );
  }
}

export default BigText;
