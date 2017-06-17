import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { addCart, addUserInformation } from '../actions'
import classNames from 'classnames';
import { Elements, StripeProvider } from 'react-stripe-elements';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import FerryInput from '../FerryInput/FerryInput.js';
import Cart from './Cart.js';

import { Input, Table, Alert, Row, Col, Button, Card, CardDeck, CardBlock, CardText, CardSubtitle, CardTitle } from 'reactstrap';
import axios from 'axios';
import config from '../config';

import '../index.css';
import './Checkout.css';

class CheckoutUserSignup extends Component {

    constructor(props){
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            alert: '',
            checked: false
        }
    }

    onSubmit(){
        var self = this
        console.log('submit')
        console.log(config)
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
                self.props.loginUser(response.data)   
                self.props.onHide(false)
                window.scrollTo(0, 0);          
            })
            .catch(function(response){
                console.log(response)
                let alert = <Alert>This email has been taken already. Try a different email.</Alert>
                self.setState({ alert: alert })
            })
        } else {
            let alert = <Alert color="danger">Please fill out all fields before submitting.</Alert>
            this.setState({ alert: alert })
        }        
    }

    onChecked(){
        this.setState({ checked: !this.state.checked })
    }

    onFirstName(e){
        this.setState({ first_name: e.target.value })
    }

    onLastName(e){
        this.setState({ last_name: e.target.value })
    }

    onEmail(e){
        this.setState({ email: e.target.value })
    }

    onPassword(e){
        this.setState({ password: e.target.value })
    }            

    render(){
        return (
            <div className={"CheckoutUserSignup " + this.props.className}>
                <Row>
                    <Col sm={{ size: 6, push: 2, pull: 2, offset: 1 }}>
                        { this.state.alert }
                    </Col>
                </Row>
                <Row className="signup-copy">
                    <Col sm={{ size: 6, push: 2, pull: 2, offset: 1 }}>
                    Create an account before moving forward with the checkout process, 
                so you can receive notifications during the order lifecycle. 
                    </Col>
                </Row>
                <br/>
                <div className="name-input">
                    <FerryInput placeholder="John" 
                        label="First Name"
                        value={this.state.first_name}
                        onChange={this.onFirstName.bind(this)}
                        style={{ width: "150px" }} />
                </div>                       
                <div className="name-input">
                    <FerryInput placeholder="Doe"
                        label="Last Name" 
                        value={this.state.last_name}
                        onChange={this.onLastName.bind(this)}                        
                        style={{ width: "150px" }} />
                </div>                                                

                <FerryInput placeholder="john.doe@gmail.com"
                    label="Email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onEmail.bind(this)}                    
                    style={{ width: "300px" }} />    
                <FerryInput placeholder="Enter a password"
                         label="Password"
                         type="password"
                         value={this.state.password}
                         onChange={this.onPassword.bind(this)}                         
                         style={{ width: "300px" }} />                                        
                
                <br/>
                <span id="terms">I agree to the Terms and Conditions</span>
                          <Input 
                          checked={this.state.checked}
                          onChange={this.onChecked.bind(this)}
                          type="checkbox" />             <br/> <br/>                                  

                <Button id="checkout-btn"
                    onClick={this.onSubmit.bind(this)}>Submit</Button>
            </div>
        )
    }
}


class FinalCheckoutStep extends Component {

    constructor(props){
        super(props)
    }

    render() {
        return (
            <div className={"FinalCheckoutStep " + this.props.className }>
              <Row>       
                  <Col sm={12}>
                    <StripeProvider apiKey="pk_test_2Tt1CLpzFPZ6GBoVcOdP8rLJ">
                        <Elements>
                            <Cart 
                                hideCart={this.props.hideCart}
                                hideReceipt={this.props.hideReceipt}                            
                                loginUser={this.props.loginUser} 
                                setAlert={this.props.setAlert} 
                                addCart={this.props.addCart} 
                                cartInformation={this.props.cartInformation} />
                        </Elements>
                    </StripeProvider>                    
                  </Col>
              </Row>                            
            </div>
        )
    }

}


class Receipt extends Component {

    constructor(props){
        super(props)

    }

    render(){
        return (
            <div className={"Receipt " + this.props.className}>
                <h3> Next Steps </h3>

                <Link to="/account/orders">Click here to message your traveller and figure out where you guys are going to meet to get your items.</Link>

            </div>
        )
    }
}


class Checkout extends Component {

  constructor(props){
    super(props)
    this.state = {
        hideFinalCheckout: true,
        alert: '',
        hideReceipt: true
    }
  }

  componentWillMount(){

    if(Object.keys(this.props.cartInformation.cart).length == 0){
        this.props.router.push('/shop')
    } 

    if(this.props.userInformation.email != null) {
        console.log(this.props)
        this.setState({ hideFinalCheckout: false })
    }           
  }

  componentDidMount(){
    window.scrollTo(0, 0);    
  }

  onHide(hide_bool){
      this.setState({ hideFinalCheckout: hide_bool })
  }

  setAlert(alert){
      this.setState({ alert: alert })
  }

  onHideCart(bool){
      this.setState({ hideFinalCheckout: bool })
  }

  onHideReceipt(bool){
      this.setState({ hideReceipt: bool })
  }
  
  render() {
    console.log(this.state)

    let checkoutUserSignupClass = classNames({ 'display-none': this.props.userInformation.email != null })
    let showFinalCheckoutClass = classNames({ 'display-none': this.state.hideFinalCheckout })
    let showReceiptClass = classNames({ 'display-none': this.state.hideReceipt })

    return (
      <div className="Checkout">
          <div className="main Checkout">
              <Header />
              <br/>
              <br/>
              <Row>       
                  <Col sm={12}>
                    <span style={{fontFamily: "Roboto Mono"}} className="shop-header">
                        Checkout
                    </span>
                  </Col>
              </Row>         
              <br/>                   
              <Row>
                <Col sm={12}>
                    { this.state.alert }
                </Col>
              </Row>
              <br/>
              <Row>       
                  <Col sm={12}>
                    <CheckoutUserSignup  loginUser={this.props.loginUser} onHide={this.onHide.bind(this)}className={checkoutUserSignupClass} />
                    <FinalCheckoutStep 
                        loginUser={this.props.loginUser}
                        setAlert={this.setAlert.bind(this)} 
                        hideCart={this.onHideCart.bind(this)}
                        hideReceipt={this.onHideReceipt.bind(this)}
                        addCart={this.props.addCart} 
                        cartInformation={this.props.cartInformation} className={showFinalCheckoutClass} />
                    <Receipt 
                        className={showReceiptClass}
                    />
                  </Col>
              </Row>                    
              <br/>
              <br/>
              <br/>

              <br/>                            
          </div>
          <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInformation: state.userInformation,
    cartInformation: state.cartInformation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userInfo) => {
      dispatch(addUserInformation(userInfo))
    },
    addCart: (cart) =>{
      dispatch(addCart(cart))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
