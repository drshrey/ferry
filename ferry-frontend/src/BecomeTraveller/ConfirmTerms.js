import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import classNames from 'classnames';

import { addUserInformation } from '../actions';
import BigText from '../BigText/BigText';

import OrderListView from '../OrderListView/OrderListView';
import config from '../config.json';

import { Alert, Row, Col, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';

import './BecomeTraveller.css';

class ConfirmTerms extends Component {

  constructor(props){
    super(props)
    this.state = {
        formShow: true,
        checked: false
    }
  }

  onChecked(e){
    this.setState({ checked: e.target.checked })
  }

  onSubmit(){
    var self = this      
    if(this.state.checked){
        let alert = <Alert color="success">Successfully signed up! You are now an official traveller in Ferry. <Link to="/travel/getting-started">Click here to learn how to start earning money on your trips.</Link></Alert>
        self.setState({ alert: alert, formShow: false })            
        self.props.incrementPercentage(25)            
        self.props.createTraveller(self.props.userInformation)             
    } else {
        let alert = <Alert color="danger">Please accept the terms before submitting.</Alert>
        self.setState({ alert: alert })    
    }
  }


  render() {
    let formShow = classNames({'display-none': !this.state.formShow});      
    return (
      <div className={this.props.className}>
          { this.state.alert }
          <div className={formShow} style={{ fontFamily: "Roboto Mono", color: "#961f47"}}>    
              You're almost done. Finish by accepting the terms and conditions in order to become a 
              validated traveller and start earning money on your trips.
              <br/>
              <br/>
              <div>
                  I accept the Terms and Conditions. {' '}
                  <span className="confirm-terms-checkbox">
                    <Input 
                        checked={this.state.checked}
                        onChange={this.onChecked.bind(this)}                        
                        type="checkbox" />
                  </span>
              </div>
              <br/>
              <br/>
              <Button 
              className={formShow}
              onClick={this.onSubmit.bind(this)}
              color="success">Travel!</Button>
          </div>          
      </div>
    );
  }
}


export default ConfirmTerms;
