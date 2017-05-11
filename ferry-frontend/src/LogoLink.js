import React, { Component } from 'react';

import './LogoLink.css';

class LogoLink extends Component {
  render() {
    return (
      <div className="LogoLink">
      	<a href={this.props.href}>
      	<img src={this.props.source}></img>
      	</a>
      	<br/>
      	{this.props.text}
      </div>
    );
  }
}

export default LogoLink;
