import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';
import PlaidLink from 'react-plaid-link';

import OrderListView from '../OrderListView/OrderListView';
import { Row, Col, Progress, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';

import './BecomeTraveller.css';

class AuthorizeBankAccount extends Component {
  constructor(props){
      super(props)
      this.state = {
          percentageComplete: 0,
      }
  }
  handleOnSuccess(token, metadata) {
    // send token to client server

    var self = this


    fetch('http://localhost:8888/users', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.userInformation.id,
        token: token
      })
    })
    .then(function(response){
      console.log(response)
      if( response.status >= 400 && response.status <= 500 ){
        response.text().then(res =>{
          self.props.setAlert(res)
        })
        self.setState({ errorState: true })
      }
      if( response.status >= 200 && response.status < 300 ){
        response.json().then(json =>{
          self.props.loginUser(json)
        })
        self.props.router.push('/dashboard')
      }
    })   
   
  }  
  render() {
    return (
      <div className={this.props.className}>
          <div className="main AuthorizeBankAccount">
              <br/>
                <h4> How do you want to get paid?</h4>
                <PlaidLink
                    buttonText="Validate Bank Account"
                    style={{
                        color: 'black',
                        background: 'white',
                        fontFamily: 'Avenir Next',
                        borderRadius: '4px',
                        border: "1 px solid black"
                    }}
                    publicKey="ecc1ae7f74f9fbd74967655f28f69f"
                    product="auth"
                    env="sandbox"
                    clientName="Ferry"
                    onSuccess={this.handleOnSuccess.bind(this)}
                    />      
            </div>
            <br/>
            <br/>
            <Row>
            <Col sm={6}>
             <Button className="member-back" onClick={this.props.onBackClick} size="lg" color="primary"> Back </Button>
            </Col>                
            <Col sm={6}>
             <Button className="member-next" onClick={this.props.onNextClick} size="lg" color="primary"> Next </Button>
            </Col>
            </Row>            
      </div>
    );
  }
}

export default AuthorizeBankAccount;
