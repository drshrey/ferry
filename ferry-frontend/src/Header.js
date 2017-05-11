import React, { Component } from 'react';

import './Header.css';
import BigLink from './BigLink.js';
import SmallLink from './SmallLink.js';

class Header extends Component {
  render() {
    return (
      <div className="Header">       
  		<BigLink href="/" text="Ferry" />
  		<div className="divider"></div>
  		<SmallLink href="/sign-up" text="SIGN UP" />
      </div>
    );
  }
}

export default Header;
