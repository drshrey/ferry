import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import MemberOfUSA from './MemberOfUSA';
import ShippingInformation from './ShippingInformation';
import AuthorizeBankAccount from './AuthorizeBankAccount';
import UserSignup from './UserSignup';
import FinishLine from './FinishLine';
import { addUserInformation } from '../actions';
import { config } from '../config.json';

import OrderListView from '../OrderListView/OrderListView';
import { Alert, Row, Col, Progress, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';
import classNames from 'classnames';

import './BecomeTraveller.css';

const MEMBER_OF_USA_PERCENTAGE = 15
const SHIPPING_PERCENTAGE = 30
const AUTHORIZE_BANK_ACCOUNT_PERCENTAGE = 30
const FINISH_PERCENTAGE = 15
const USER_SIGN_UP_PERCENTAGE = 25

class BecomeTraveller extends Component {
  constructor(props){
      super(props)
      this.state = {
          percentageComplete: 0,
          memberHide: false,
          shippingHide: true,
          authorizeBankHide: true,
          userSignupHide: true,
          finishHide: true,
          country: 'US',
          streetAddress: '',
          state: 'Alabama',
          zipCode: '',
          city: '',
          alert: '',
          visible: false,
          publicToken: ''
      }
  }

  onNextClick(component){
    let percentComplete = this.state.percentageComplete
    switch(component){
        case "MemberOfUSA":
            percentComplete += MEMBER_OF_USA_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: false, authorizeBankHide: true, userSignupHide: true, finishHide: true })
            break;
        case "ShippingInformation":
            console.log(this.state)
            if(this.state.streetAddress && this.state.city && this.state.zipCode && this.state.state){
                percentComplete += SHIPPING_PERCENTAGE
                this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: false, userSignupHide: true, finishHide: true })
            } else {
                this.setState({ alert: 'All fields must be completed.', visible: true})
            }
            break;
        case "AuthorizeBankAccount":
            console.log('onto user signup')
            percentComplete += AUTHORIZE_BANK_ACCOUNT_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: true, userSignupHide: false, finishHide: true })
            break;
        case "UserSignUp":
            percentComplete += USER_SIGN_UP_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: true, userSignupHide: true, finishHide: false })
            break;        
        case "FinishLine":
            percentComplete += FINISH_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: true, userSignupHide: true, finishHide: true  })
        default:
            break;
    }
  }

  onCountryChange(e){
      console.log(e.target.value)
      this.setState({ country: e.target.value })
  }

  onStateChange(e){
      this.setState({ state: e.target.value })
  }

  onStreetAddressChange(e){
      this.setState({ streetAddress: e.target.value })
  }

  onZipCodeChange(e){
      this.setState({ zipCode: e.target.value })
  }

  onCityChange(e){
      this.setState({ city: e.target.value })
  }

  onPublicToken(token){
      this.setState({ publicToken: token })
  }

  


  onBackClick(component){
      console.log('onBackClick ' + component)
      let percentComplete = this.state.percentageComplete
      switch(component){
          case "ShippingInformation":
              // because MemberOfUSA is the component before ShippingInformation
              percentComplete -= MEMBER_OF_USA_PERCENTAGE
              this.setState({ visible: false, percentageComplete: percentComplete, memberHide: false, shippingHide: true, authorizeBankHide: true })
              break;
          case "AuthorizeBankAccount":
              percentComplete -= SHIPPING_PERCENTAGE
              this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: false, authorizeBankHide: true  })
              break;    
          case "FinishLine":
              percentComplete -= AUTHORIZE_BANK_ACCOUNT_PERCENTAGE
              this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: false })
              break;
          default:
              break;
      }      
  }

  onDismiss(){
      this.setState({ visible: false })
  }

  incrementPercentage(num){
      this.setState({ percentageComplete: this.state.percentageComplete + num })
  }

  onSubmit(response){
        var self = this
        fetch(config.api_url + '/travellers', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: response.user_id,
            country: self.state.country,
            streetAddress: self.state.streetAddress,
            state: self.state.state,
            zipCode: self.state.zipCode,
            city: self.state.city,
            publicToken: self.state.publicToken
          })
        })
        .then(function(response){
          console.log(response)
          if( response.status >= 400 && response.status <= 500 ){
            response.text().then(res =>{
              self.setState({ alert: res, visible: true })
            })
          }
          if( response.status >= 200 && response.status < 300 ){
            response.json().then(json =>{
              self.props.addTraveller(self.props.userInformation, json)
            })
          }
        })         
  }

  render() {
    let memberClass = classNames({'display-none': this.state.memberHide});      
    let shippingClass = classNames({'display-none': this.state.shippingHide});      
    let authorizeBankClass = classNames({'display-none': this.state.authorizeBankHide});      
    let signupClass = classNames({'display-none': this.state.userSignupHide});      

    if( this.props.userInformation.length > 0 ){
        signupClass = classNames({'display-none': true });
    }
    console.log(this.props)
    console.log(this.state)
    console.log(signupClass)
    return (
      <div>
      <div className="BecomeTraveller">
          <div className="main">
              <Header />
              <br/>
              <BigText text="Become a Traveller" />
            <div className="text-center">{this.state.percentageComplete}%</div>
              <Progress value={this.state.percentageComplete} />              
              <br/>
              <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>{this.state.alert}</Alert>

              <MemberOfUSA className={memberClass} 
                onCountryChange={this.onCountryChange.bind(this)}
                country={this.state.country} 
                onNextClick={() => this.onNextClick('MemberOfUSA').bind(this)} />
              <ShippingInformation className={shippingClass} 
                onStateChange={this.onStateChange.bind(this)}
                onStreetAddressChange={this.onStreetAddressChange.bind(this)}
                onCityChange={this.onCityChange.bind(this)}
                onZipCodeChange={this.onZipCodeChange.bind(this)}
                state={this.state.state}
                streetAddress={this.state.streetAddress}
                city={this.state.city}
                zipCode={this.state.zipCode}
                onNextClick={() => this.onNextClick('ShippingInformation').bind(this)} 
                onBackClick={() => this.onBackClick('ShippingInformation').bind(this)}   />
              <AuthorizeBankAccount className={authorizeBankClass} 
                onPublicToken={this.onPublicToken.bind(this)}
                token={this.state.publicToken}
                onBackClick={() => this.onBackClick('AuthorizeBankAccount').bind(this)}
                onNextClick={() => this.onNextClick('AuthorizeBankAccount').bind(this)} />                
              <UserSignup className={signupClass} 
                onUser={this.onPublicToken.bind(this)}
                createTraveller={this.onSubmit.bind(this)}
                incrementPercentage={this.incrementPercentage.bind(this)}
                onNextClick={() => this.onNextClick('UserSignup').bind(this)} />
            </div>
        </div>
        <Footer />        
    </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addTraveller: (userInfo, travellerInfo) => {
        userInfo['traveller'] = travellerInfo
        dispatch(addUserInformation(userInfo))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BecomeTraveller);
