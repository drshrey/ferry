import React, { Component, PropTypes } from 'react';

import './FerryInput.css';

class FerryInput extends Component {
  render() {
    if(this.props.label){
      return (
        <div>
            <b>{this.props.label}</b>        <br/>
            <input 
            onKeyPress={this.props.onKeyPress}
            onChange={this.props.onChange} value={this.props.value} className="FerryInput" type={this.props.type} placeholder={this.props.placeholder} required={this.props.required} />
        </div>
      );
    } else {
      return (
        <div>
            <input 
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
