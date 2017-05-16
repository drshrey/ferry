import React, { Component } from 'react';
import { Link } from 'react-router';

import './SmallLink.css';

class SmallLink extends Component {
  render() {
    return (
      <div className="SmallLink">
        <Link to={this.props.href}> {this.props.text} </Link>
      </div>
    );
  }
}

export default SmallLink;
