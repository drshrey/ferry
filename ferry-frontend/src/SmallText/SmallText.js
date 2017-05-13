import React, { Component } from 'react';

import './SmallText.css';

class SmallText extends Component {
  render() {
    return (
      <div className="SmallText">
        {this.props.text}
      </div>
    );
  }
}

export default SmallText;
