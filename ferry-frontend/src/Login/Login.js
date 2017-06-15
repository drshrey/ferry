import React, { Component } from 'react';

import { connect } from 'react-redux';
import { addUserInformation } from '../actions';
import { Link } from 'react-router';

import { Button } from 'reactstrap';

import logo from '../static/logo.svg';
import FerryInput from '../FerryInput/FerryInput.js';
import Header from '../Header/Header.js';
import SmallText from '../SmallText/SmallText.js';
import FerrySubmit from '../FerrySubmit/FerrySubmit.js';
import Footer from '../Footer/Footer.js';
import config from '../config.json';

import Error from '../Error/Error.js'
import './Login.css';

class Login extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      hasUsernameError: false,
      hasPasswordError: false,
      errMsg: ''
    }
  }
  
  handleUsername(e){
    this.setState({ username: e.target.value })
  }

  handlePassword(e){
    this.setState({ password: e.target.value })
  }

  onKeyPress(e){
    console.log(e.key)
    if(e.key == 'Enter'){
      this.handleSubmit()
    }
  }

  handleSubmit(e){
    // check if all fields are there
    // if not, send appropriate form errors
    if(e)
      e.preventDefault()
    var self = this;    

    let error = false
    if(this.state.username == ''){
      this.setState({ hasUsernameError: true })
      error = true
    } else {
      this.setState({ hasUsernameError: false })
    }
    if(this.state.password == ''){
      this.setState({ hasPasswordError: true })
      error = true
    } else {
      this.setState({ hasPasswordError: false })
    }
    if( error ){
      return
    }

    if(!this.state.hasUsernameError && !this.state.hasPasswordError){

        fetch(config.api_url + '/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.username,
            password: this.state.password
          })
        })
        .then(function(response){
          console.log(response)
          if( response.status >= 400 && response.status <= 500 ){
            response.text().then(res =>{
              self.setState({ errMsg: res})
            })
            self.setState({ errorState: true })
          }
          if( response.status >= 200 && response.status < 300 ){
            response.json().then(json =>{
              self.props.loginUser(json)
              if(json.traveller != null){
                self.props.router.push('/travel')
              } else {
                self.props.router.push('/shop')
              }              
            })
          }
        })              
      }
  }

  render() {
    var firstNameError = ""
    var lastNameError = ""
    var usernameError = ""
    var passwordError = ""

    if(this.state.hasFirstNameError){
      firstNameError = <Error msg="First name is a required field." />
    }

    if(this.state.hasLastNameError){
      lastNameError = <Error msg="Last name is a required field." />
    }

    if(this.state.hasUsernameError){
      usernameError = <Error msg="Username is a required field." />
    }

    if(this.state.hasPasswordError){
      passwordError = <Error msg="Password is a required field." />
    }           


    return (
      <div className="Login">
        <div className="login-main">
          <span className="login-header">
            <img src={logo}></img> {' '}
            <span id="login-header-label">Ferry</span>
          </span>
          <div className="login-info">
            <form onSubmit={this.handleSubmit.bind(this)}>
            <h4> Member Login </h4>
              <FerryInput 
                onKeyPress={this.onKeyPress.bind(this)}
                onChange={this.handleUsername.bind(this) } type="email" required={true} placeholder="ENTER EMAIL" />
              {usernameError}              
              <FerryInput 
                onKeyPress={this.onKeyPress.bind(this)}
                onChange={this.handlePassword.bind(this) } type="password" required={true} placeholder="ENTER PASSWORD" />
              {passwordError}              
              <Button className="login-btn" dataLoadingText="Loading..." color="success" onClick={this.handleSubmit.bind(this) }>Login</Button>
            </form>
            <Error msg={this.state.errMsg} />
          </div>          
          <br/>
          <div className="dont-have-an-account">
            Don't have an account? <Link to="/signup">Sign up here.</Link>
          </div>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userInfo) => {
      dispatch(addUserInformation(userInfo))
    }
  }
}
export default connect(null, mapDispatchToProps)(Login);
