import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import MemberOfUSA from './MemberOfUSA';
import ShippingInformation from './ShippingInformation';
import AuthorizeBankAccount from './AuthorizeBankAccount';
import FinishLine from './FinishLine';

import OrderListView from '../OrderListView/OrderListView';
import { Alert, Row, Col, Progress, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';
import classNames from 'classnames';

import './BecomeTraveller.css';

const MEMBER_OF_USA_PERCENTAGE = 15
const SHIPPING_PERCENTAGE = 30
const AUTHORIZE_BANK_ACCOUNT_PERCENTAGE = 40
const FINISH_PERCENTAGE = 30

class BecomeTraveller extends Component {
  constructor(props){
      super(props)
      this.state = {
          percentageComplete: 0,
          memberHide: false,
          shippingHide: true,
          authorizeBankHide: true,
          finishHide: true,
          country: 'United States of America',
          streetAddress: '',
          state: 'Alabama',
          zipCode: '',
          city: '',
          alert: '',
          visible: false
      }
  }

  onNextClick(component){
    let percentComplete = this.state.percentageComplete
    switch(component){
        case "MemberOfUSA":
            percentComplete += MEMBER_OF_USA_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: false, authorizeBankHide: true, finishHide: true })
            break;
        case "ShippingInformation":
            console.log(this.state)
            if(this.state.streetAddress && this.state.city && this.state.zipCode && this.state.state){
                percentComplete += SHIPPING_PERCENTAGE
                this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: false, finishHide: true })
            } else {
                this.setState({ alert: 'All fields must be completed.', visible: true})
            }
            break;
        case "AuthorizeBankAccount":
            percentComplete += AUTHORIZE_BANK_ACCOUNT_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: true, finishHide: false })
            break;
        case "FinishLine":
            percentComplete += FINISH_PERCENTAGE
            this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: true, finishHide: true  })
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

  onBackClick(component){
      console.log('onBackClick ' + component)
      let percentComplete = this.state.percentageComplete
      switch(component){
          case "ShippingInformation":
              // because MemberOfUSA is the component before ShippingInformation
              percentComplete -= MEMBER_OF_USA_PERCENTAGE
              this.setState({ visible: false, percentageComplete: percentComplete, memberHide: false, shippingHide: true, authorizeBankHide: true, finishHide: true })
              break;
          case "AuthorizeBankAccount":
              percentComplete -= SHIPPING_PERCENTAGE
              this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: false, authorizeBankHide: true, finishHide: true  })
              break;    
          case "FinishLine":
              percentComplete -= AUTHORIZE_BANK_ACCOUNT_PERCENTAGE
              this.setState({ visible: false, percentageComplete: percentComplete, memberHide: true, shippingHide: true, authorizeBankHide: false, finishHide: true  })
              break;
          default:
              break;
      }      
  }

  onDismiss(){
      this.setState({ visible: false })
  }

  render() {
    let memberClass = classNames({'display-none': this.state.memberHide});      
    let shippingClass = classNames({'display-none': this.state.shippingHide});      
    let authorizeBankClass = classNames({'display-none': this.state.authorizeBankHide});      
    let finishClass = classNames({'display-none': this.state.finishHide});      

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
                onBackClick={() => this.onBackClick('AuthorizeBankAccount').bind(this)}
                onNextClick={() => this.onNextClick('AuthorizeBankAccount').bind(this)} />                
              <FinishLine className={finishClass} 
                onBackClick={() => this.onBackClick('FinishLine').bind(this)} />
            </div>
        </div>
        <Footer />        
    </div>
    );
  }
}

export default BecomeTraveller;
