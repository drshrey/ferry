import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCart, addUserInformation } from '../actions'
import classNames from 'classnames';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import FerryInput from '../FerryInput/FerryInput.js';
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

class Cart extends Component {
    constructor(props){
        super(props)
        this.state  = {
            items: [],
            dict_items: {
                1: {
                    name: "iPhone 7",
                    description: "iPhone 7 dramatically improves the most important aspects of the iPhone experience. It introduces advanced new camera systems.",
                    id: 1,
                    size: 20,
                    price: 700
                } 
            },
            total: 0,
            commission: 50            
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        this.computeTotals(nextProps)
    }

    onMinusClick(e, item){
        e.preventDefault()
        let cart = this.props.cartInformation.cart
        if(cart[item.id] > 1){
            cart[item.id] -= 1
        }
        this.props.addCart(cart)
    }

    onPlusClick(e, item){
        e.preventDefault()
        let cart = this.props.cartInformation.cart
        cart[item.id] += 1
        this.props.addCart(cart)        
    }

    computeTotals(nextProps){
        let items = []
        var self = this
        let subtotal = 0
        let commission = 50

        let props = this.props
        if(nextProps != null){
            props = nextProps
        }

        Object.keys(props.cartInformation.cart).forEach(function(item_key){
        let item = self.state.dict_items[item_key]
            items.push(    
                    <tr>
                        <td><b>{item.name} (x{props.cartInformation.cart[item_key]}) 
                            <a id="plus"
                               onClick={(evt) => self.onMinusClick(evt, item).bind(self)}
                               className="quantity-change-btn" href="#">-</a> 
                            <a id="minus" 
                                onClick={(evt) => self.onPlusClick(evt, item).bind(self)}
                                className="quantity-change-btn" href="#">+</a></b></td>
                        <td><b>${item.price * props.cartInformation.cart[item_key]}</b></td>
                    </tr>                       
            )
            subtotal += item.price * props.cartInformation.cart[item_key]
        })
        commission = commission + (subtotal * 0.1)

        this.setState({ subtotal: subtotal, items: items, total: subtotal + commission, commission: commission })
    }

    componentWillMount(){
        this.computeTotals()
    }


    render() {
        return (
            <div className="Cart">
                <h3> Your Order </h3>
                <br/>
                <Table style={{textAlign: "left"}} >
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.items }
                    <tr>
                        <td>Subtotal</td>
                        <td>${this.state.subtotal}</td>
                    </tr>                           
                    <tr>
                        <td className="commission">Traveller's Commission</td>
                        <td>${this.state.commission}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>${this.state.total}</td>
                    </tr>                    
                    </tbody>
                </Table>

                Pay with your credit card via Stripe. <br/><br/>
                <FerryInput label="Credit/ Debit Card Number" placeholder="**** **** **** ****" />
                <div className="name-input">
                    <FerryInput label="Expiry (MM/YY)" placeholder="08/19" style={{ width: "140px" }} />
                </div>                
                <div className="name-input">
                    <FerryInput label="Security Code" placeholder="CVC" style={{ width: "120px" }} />
                </div>                                

                <br/>
                <br/>
                <Button style={{width: "275px"}} id="checkout-btn">Place Order</Button>


                    
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
                    <Cart addCart={this.props.addCart} cartInformation={this.props.cartInformation} />
                  </Col>
              </Row>                            
            </div>
        )
    }

}


class Checkout extends Component {

  constructor(props){
    super(props)
    this.state = {
        hideFinalCheckout: true
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
  
  render() {
    console.log(this.state)

    let checkoutUserSignupClass = classNames({ 'display-none': this.props.userInformation.email != null })
    let showFinalCheckoutClass = classNames({ 'display-none': this.state.hideFinalCheckout })

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
                    <CheckoutUserSignup  loginUser={this.props.loginUser} onHide={this.onHide.bind(this)}className={checkoutUserSignupClass} />
                    <FinalCheckoutStep  
                        addCart={this.props.addCart} 
                        cartInformation={this.props.cartInformation} className={showFinalCheckoutClass} />
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
