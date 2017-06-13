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
    this.props.onPublicToken(token)
  }  

  render() {
    let nextButton = <Button className="member-next" onClick={this.props.onNextClick} size="lg" disabled> Next </Button>
    let token = (
      <div>
                <h4> How do you want to get paid?</h4>
                <br/><br/>
                <PlaidLink
                    buttonText="Validate Bank Account"
                    style={{
                      fontFamily: 'Avenir Next',
                      border: "1px solid #961f47",
                      backgroundColor: "#961f47",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                    publicKey="ecc1ae7f74f9fbd74967655f28f69f"
                    product="auth"
                    env="sandbox"
                    clientName="Ferry"
                    onSuccess={this.handleOnSuccess.bind(this)}
                    />        
                    </div>
    )
    
    
    if(this.props.token != ""){
      nextButton = <Button className="member-next" onClick={this.props.onNextClick} size="lg"> Next </Button>      
      token = (
        <div>
          <span className="validated-message"> Awesome, your bank account is validated! You'll be able to receive instant payments for your trips now.</span>
        </div>
      )  
    }
    return (
      <div className={this.props.className}>
          <div className="main AuthorizeBankAccount">
              <br/>
              { token }    
            </div>
            <Row>
            <Col sm={6}>
             <Button className="member-back" onClick={this.props.onBackClick} size="lg"> Back </Button>
            </Col>                
            <Col sm={6}>
             { nextButton }
            </Col>
            </Row>            
      </div>
    );
  }
}

export default AuthorizeBankAccount;
