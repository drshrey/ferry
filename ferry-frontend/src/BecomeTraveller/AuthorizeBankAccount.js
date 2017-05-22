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
          percentageComplete: 0
      }
  }
  handleOnSuccess(token, metadata) {
    // send token to client server
    console.log(token)
    console.log(metadata)
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
                        border: '1px solid darkgray'
                    }}
                    className=""
                    publicKey="ecc1ae7f74f9fbd74967655f28f69f"
                    product="auth"
                    env="sandbox"
                    clientName="59054aa74e95b85862b74c6d"
                    onSuccess={this.handleOnSuccess}
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
