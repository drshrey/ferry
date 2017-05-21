import React, { Component } from 'react';

/* redux related imports */
import { connect } from 'react-redux';

/* component related imports */
import { Button } from 'reactstrap';
import './SignUp.css';
import FerryInput from '../FerryInput/FerryInput.js';
import Header from '../Header/Header.js';
import SmallText from '../SmallText/SmallText.js';
import FerrySubmit from '../FerrySubmit/FerrySubmit.js';
import { addUserInformation } from '../actions';

import Error from '../Error/Error.js'

import '../index.css';


class SignUp extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      hasFirstNameError: false,
      hasLastNameError: false,
      hasUsernameError: false,
      hasPasswordError: false
    }
  }
  
  handleFirstName(e){
    this.setState({ firstName: e.target.value })
  }

  handleLastName(e){
    this.setState({ lastName: e.target.value })
  }

  handleUsername(e){
    this.setState({ username: e.target.value })
  }

  handlePassword(e){
    this.setState({ password: e.target.value })
  }

  sendUserInformation(userInformation){

  }

  handleSubmit(e){
    // check if all fields are there
    // if not, send appropriate form errors
    e.preventDefault()
    var error = false
    console.log('hello there')
    if(this.state.firstName == ''){
      this.setState({ hasFirstNameError: true })
      error = true
    } else {
      this.setState({ hasFirstNameError: false })
    }
    if(this.state.lastName == ''){
      this.setState({ hasLastNameError: true })
      error = true
    } else {
      this.setState({ hasLastNameError: false })
    }
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
    
    
    if(!error){
        var self = this;
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
        .then(function(response){
          if( response.status >= 400 && response.status <= 500 ){
            console.log(response)
            response.text().then(text =>{
              self.setState({ errMsg: text })
            })
            self.setState({ errorState: true })
          }
          if( response.status >= 200 && response.status < 300 ){
            response.json().then(json =>{
              console.log(json)
              self.props.loginUser(json)
            })
            self.props.router.push('/dashboard')
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
      usernameError = <Error msg="Email is a required field." />
    }

    if(this.state.hasPasswordError){
      passwordError = <Error msg="Password is a required field." />
    }            

    return (
      <div className="SignUp">
        <div className="main">
          <Header />
          <div className="signup-info">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <h4>Member sign up</h4>
              <FerryInput onChange={this.handleFirstName.bind(this) } type="text" placeholder="ENTER FIRST NAME" />
              {firstNameError}              
              <FerryInput onChange={this.handleLastName.bind(this) } type="text" placeholder="ENTER LAST NAME" />
              {lastNameError}              
              <FerryInput onChange={this.handleUsername.bind(this) } type="text" placeholder="ENTER EMAIL" />
              {usernameError}
              <FerryInput onChange={this.handlePassword.bind(this) } type="password" placeholder="ENTER PASSWORD" />
              {passwordError}              
              <Button color="success" className="signup-btn" onClick={this.handleSubmit.bind(this) }>Sign Up</Button>
            </form>
            <Error msg={ this.state.errMsg } />          
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


export default connect(null, mapDispatchToProps)(SignUp);
