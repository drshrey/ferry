import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import logo from '../static/logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './Header.css';

import BigLink from '../BigLink/BigLink.js';
import SmallLink from '../SmallLink/SmallLink.js';
import Line from '../Line/Line.js';

import { logout } from '../actions';


class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      isOpen: false,
      dropdownOpen: false      
    }
  }

  logout(){
    this.props.logoutUser()
    window.location.href = '/'
  }
  
  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }  

  render() {
    if(this.props.userInformation.email){
      let profile = "Profile"
      if(this.props.userInformation.profile_picture_url){
          profile = <img className="HeaderImage" src={"data:image/png;base64," + this.props.userInformation.profile_picture_url}></img>
      }      
      console.log('logo', logo)
      return (
          <div>
            <div>  
              <Navbar color="white" light toggleable>
                <img style={{width: "60px", marginRight: "10px"}}src={logo}></img>
                <BigLink href="/" text="Ferry" />
                <NavbarToggler   onClick={this.toggle.bind(this)} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <SmallLink className="header-link" href="/shop" text="Shop" />
                    </NavItem>
                    <NavItem>
                      <SmallLink className="header-link" href="/travel" text="Travel" />            
                    </NavItem>
                    <NavItem>
                      <SmallLink className="header-link" href="/travel" text="Messages" />            
                    </NavItem>
                    <NavItem>
                      <SmallLink className="header-link" href="/travel" text="Help" />            
                    </NavItem>                                        
                    <NavItem className="dropdown-nav">   
                      <Dropdown className="dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown.bind(this)}>
                        <DropdownToggle className="toggle" caret>
                          { profile }
                        </DropdownToggle>
                        <DropdownMenu style={{ fontFamily: "Roboto Mono"}}>
                          <DropdownItem header>Signed in as {this.props.userInformation.first_name}</DropdownItem>
                          <DropdownItem divider></DropdownItem>
                          <DropdownItem><Link to="/account">Your Account</Link></DropdownItem>
                          <DropdownItem><Link to="/account/orders">View Orders</Link></DropdownItem>
                          <DropdownItem><Link to="/account/travel">Traveller Info</Link></DropdownItem>
                          <DropdownItem><a onClick={this.logout.bind(this)}>Logout</a></DropdownItem>                       
                        </DropdownMenu>
                      </Dropdown>                                         
                    </NavItem>
                  </Nav>
                </Collapse>                
              </Navbar>                   
            </div>
          </div>
      )
    } else {
      return (
          <div>

            <div>  
              <Navbar color="white" light toggleable>
                <img style={{width: "60px", marginRight: "10px"}}src={logo}></img>
                <BigLink href="/" text="Ferry" />
                <NavbarToggler right onClick={this.toggle.bind(this)} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <SmallLink href="/login" text="Login" />
                    </NavItem>
                    <NavItem>
                      <SmallLink href="#" text="En Espanõl" />
                    </NavItem>                    
                    <NavItem>
                      <SmallLink href="/signup" text="Sign Up" />            
                    </NavItem>
                  </Nav>
                </Collapse>                
              </Navbar>                   
            </div>            
          </div>        
      )
    }
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => {
      dispatch(logout())
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);
