import React, { Component } from 'react';

import './Header.css';
import BigLink from '../BigLink/BigLink.js';
import SmallLink from '../SmallLink/SmallLink.js';
import Line from '../Line/Line.js';

class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }
    if(this.props.loggedIn){
      this.setState({ loggedIn: this.props.loggedIn })
    }
  }
  render() {
    var output = undefined
    if(this.state.loggedIn){
      output = (
          <div>

            <div className="Header">       
            <BigLink href="/" text="Ferry" />
            <div className="divider"></div>
            <SmallLink href="/shop" text="SHOP" />
            <SmallLink href="/travel" text="TRAVEL" />
            </div>

            <Line />        	            
          </div>
      )
    } else {
      output = (
          <div>

            <div className="Header">       
            <BigLink href="/" text="Ferry" />
            <div className="divider"></div>
            <SmallLink href="/login" text="LOGIN" />
            <SmallLink href="/signup" text="SIGN UP" />
            </div>

            <Line />        	            
          </div>        
      )
    }
    return output;
  }
}

export default Header;
