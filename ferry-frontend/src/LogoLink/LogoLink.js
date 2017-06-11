import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'reactstrap';

import './LogoLink.css';

class LogoLink extends Component {
  render() {
    return (
      <div style={this.props.style} className="LogoLink">
            <a href={this.props.href}>
            <img style={this.props.imageStyle} className={"LogoImage " + this.props.imageClassName} src={this.props.source}></img>
            <span style={this.props.labelStyle} className={"label " + this.props.labelClassName}> {this.props.label} </span>
            </a>            
      </div>
    );
  }
}

export default LogoLink;

