import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Header.css';
import BigLink from '../BigLink/BigLink.js';
import SmallLink from '../SmallLink/SmallLink.js';
import Line from '../Line/Line.js';


class Header extends Component {
  constructor(props){
    super(props)
  }
  render() {
    if(this.props.userInformation.email){
      return (
          <div>

            <div className="Header">       
            <BigLink href="/" text="Ferry" />
            <div className="auth divider"></div>
            Hi, <SmallLink href="/profile" text={this.props.userInformation.email} />
            <SmallLink href="/shop" text="SHOP" />
            <SmallLink href="/travel" text="TRAVEL" />
            </div>

            <Line />        	            
          </div>
      )
    } else {
      return (
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
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}



export default connect(mapStateToProps)(Header);
