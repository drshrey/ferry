import React, { Component } from 'react';

import './FerrySubmit.css';
import '../index.css';

class FerrySubmit extends Component {
  render() {
    return (
      <div>
        <input onClick={this.props.onClick} className="FerrySubmit" type="submit" value={this.props.text} />
      </div>
    );
  }
}

export default FerrySubmit;
