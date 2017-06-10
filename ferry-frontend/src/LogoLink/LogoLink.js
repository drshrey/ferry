import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'reactstrap';

import './LogoLink.css';

class LogoLink extends Component {
  render() {
    return (
      <div className="LogoLink">
            <a href={this.props.href}>
            <img className="LogoImage" src={this.props.source}></img>
            <span className="label"> {this.props.label} </span>
            </a>            
      </div>
    );
  }
}

export default LogoLink;

