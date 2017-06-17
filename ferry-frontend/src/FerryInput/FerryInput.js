import React, { Component, PropTypes } from 'react';

import './FerryInput.css';

class FerryInput extends Component {
  render() {
    if(this.props.label){
      return (
        <div style={{ fontFamily: "Roboto Mono"}}>
            {this.props.label}        <br/>
            <input 
            maxLength={this.props.maxLength}
            style={this.props.style}
            onKeyPress={this.props.onKeyPress}
            onChange={this.props.onChange} value={this.props.value} className="FerryInput" type={this.props.type} placeholder={this.props.placeholder} required={this.props.required} />
        </div>
      );
    } else {
      return (
        <div>
            <input 
            style={this.props.style}
            maxLength={this.props.maxLength}
            onKeyPress={this.props.onKeyPress}
            onChange={this.props.onChange} value={this.props.value} className="FerryInput" type={this.props.type} placeholder={this.props.placeholder} required={this.props.required} />
        </div>
      );      
    }

  }
}

FerryInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string
}

export default FerryInput;
