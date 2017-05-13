import React, { Component } from 'react';

import './Login.css';
import FerryInput from '../FerryInput/FerryInput.js';
import Header from '../Header/Header.js';
import SmallText from '../SmallText/SmallText.js';
import FerrySubmit from '../FerrySubmit/FerrySubmit.js';

import Error from '../Error/Error.js'

import '../index.css';

class Login extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      hasUsernameError: false,
      hasPasswordError: false
    }
  }
  
  handleUsername(e){
    this.setState({ username: e.target.value })
  }

  handlePassword(e){
    this.setState({ password: e.target.value })
  }

  handleSubmit(e){
    // check if all fields are there
    // if not, send appropriate form errors
    e.preventDefault()
    console.log('hello there')

    if(this.state.username == ''){
      this.setState({ hasUsernameError: true })
    } else {
      this.setState({ hasUsernameError: false })
    }
    if(this.state.password == ''){
      this.setState({ hasPasswordError: true })
    } else {
      this.setState({ hasPasswordError: false })
    }

    if(!this.state.hasUsernameError && !this.state.hasPasswordError){
        fetch('http://localhost:8888/users', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.username,
            password: this.state.password,
            first_name: this.state.firstName,
            last_name: this.state.lastName
          })
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
        <div className="main">
          <Header />
          <div className="login-info">
            <form onSubmit={this.handleSubmit.bind(this)}>
            <SmallText text="Login to ferry." />
              {usernameError}
              <FerryInput onChange={this.handleUsername.bind(this) } type="text" placeholder="ENTER USERNAME" />
              {passwordError}
              <FerryInput onChange={this.handlePassword.bind(this) } type="password" placeholder="ENTER PASSWORD" />
              <FerrySubmit onClick={this.handleSubmit.bind(this) } text="Login" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
