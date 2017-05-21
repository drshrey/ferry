import React, { Component } from 'react';

import './LogoLink.css';

class LogoLink extends Component {
  render() {
    return (
      <div className="LogoLink">
      	<a href={this.props.href}>
      	<img className="LogoImage" src={this.props.source}></img><br/>
      	{this.props.text}        
      	</a>
      	<br/>
      </div>
    );
  }
}

export default LogoLink;

