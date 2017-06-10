import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import classNames from 'classnames';

import { addUserInformation } from '../actions';
import BigText from '../BigText/BigText';

import OrderListView from '../OrderListView/OrderListView';
import config from '../config.json';
import { Alert, Row, Col, Progress, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';

import './BecomeTraveller.css';

class UserSignup extends Component {
  constructor(props){
      super(props)
      this.state = {
          email: '',
          password: '',
          alert: '',
          last_name: '',
          first_name: '',
          checked: false,
          formShow: true
      }
  }
  handleOnSuccess(token, metadata) {
    this.props.onPublicToken(token)
   
  }  
  
  onEmail(e){
    this.setState({ email: e.target.value })
  }

  onPassword(e){
    this.setState({ password: e.target.value })
  }

  onFirstName(e){
    this.setState({ first_name: e.target.value })
  }

  onLastName(e){
    this.setState({ last_name: e.target.value })
  }

  onSubmit(){
    var self = this
    console.log('submit')
    if(this.state.email && this.state.password && this.state.first_name && this.state.checked){
      axios({
        method: 'post',
        url: config.api_url + '/users',
        data: {
          email: self.state.email,
          first_name: self.state.first_name,
          last_name: self.state.last_name,
          password: self.state.password
        }
      })
        .then(function(response){
          console.log(response)
          let alert = <Alert color="success">Successfully signed up! You are now an official traveller in Ferry. <Link to="/travel/getting-started">Click here to learn how to start earning money on your trips.</Link></Alert>
          self.setState({ alert: alert, formShow: false })
          self.props.incrementPercentage(25)            
          self.props.loginUser(response.data)   
          self.props.createTraveller(response.data)             
          window.scrollTo(0, 0);          
        })
        .catch(function(response){
          let alert = <Alert>This email has been taken already. Try a different email.</Alert>
          self.setState({ alert: alert })
        })
    } else {
      let alert = <Alert color="danger">Please fill out all fields before submitting.</Alert>
      this.setState({ alert: alert })
    }
  }

  onChecked(e){
    this.setState({ checked: e.target.checked })
  }

  render() {
    let formShow = classNames({'display-none': !this.state.formShow});      
    return (
      <div className={this.props.className}>
          <div className="main UserSignup">    
              Finish by creating your user account. We'll send you a confirmation email afterwards.
              <br/>
              <br/>
                {this.state.alert}
                <br/>
                <Form className={formShow}>
                    <Form className="user-signup">
                        <FormGroup>
                        <Col sm={6} style={{ margin: "auto" }}>
                            <Label><b>First Name</b></Label>
                                <Input 
                                  value={this.state.first_name}
                                  onChange={this.onFirstName.bind(this)}
                                  placeholder="Enter your first name"
                                  type="text"
                                />
                        </Col>     
                        </FormGroup> {' '}                    
                        <FormGroup>
                            <Col sm={6} style={{ margin: "auto" }}>
                                <Label><b>Last Name</b></Label>
                                    <Input 
                                      value={this.state.last_name}
                                      onChange={this.onLastName.bind(this)}
                                      placeholder="Enter your last name"
                                      type="text"
                                    /> 
                            </Col>                         
                        </FormGroup>                                               
                    </Form>                    
                    <FormGroup>
                        <Col sm={6} style={{ margin: "auto" }}>
                            <Label for="streetAddress"><b>Email</b></Label>
                            <Input 
                              value={this.state.email}
                              onChange={this.onEmail.bind(this)}
                              placeholder="Enter your email..."
                              type="text"
                            />
                        </Col>                         
                    </FormGroup>                      
                    <FormGroup>
                        <Col sm={6} style={{ margin: "auto" }}>
                          <Label><b>Password</b></Label>
                            <Input 
                              value={this.state.password}
                              onChange={this.onPassword.bind(this)}
                              placeholder="Enter a password"
                              type="password"
                            />                          
                        </Col>
                    </FormGroup>
                  <FormGroup>
                      <Col sm={6} style={{ margin: "auto" }}>
                        <Label style={{ marginRight: "40px" }}>I agree to the terms and conditions.</Label>
                          <Input 
                          checked={this.state.checked}
                          onChange={this.onChecked.bind(this)}
                          type="checkbox" />                                                  
                      </Col>
                  </FormGroup>                      
                </Form>              
                <br/>
                <Button className={formShow} color="success" onClick={this.onSubmit.bind(this)}>Sign Up</Button>
          </div>
            <br/>
            <br/>
            <Row>
            <Col sm={6}>
             <Button className={formShow + " member-back"} onClick={this.props.onBackClick} size="lg" color="primary"> Back </Button>
            </Col>                
            </Row>            
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
export default connect(null, mapDispatchToProps)(UserSignup);
