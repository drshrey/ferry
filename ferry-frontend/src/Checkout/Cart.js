import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addCart, setCartFilled } from '../actions.js';

import FerryInput from '../FerryInput/FerryInput.js';
import { Alert, Table, Button } from 'reactstrap';
import { CardElement, injectStripe, StripeProvider } from 'react-stripe-elements';

import config from '../config.json';

class Cart extends Component {
    constructor(props){
        super(props)
        this.state  = {
            dict_items: {},
            total: 0,
            commission: 50               
        }
        let cart = this.props.cartInformation.cart        
        this.props.addCart(cart)   
    }

    componentWillMount(){
        var self = this
        let dict_items= {}
        axios({
            method: 'get',
            url: config.api_url + '/items'
        })
            .then(function(response){
                console.log(response)
                response.data.forEach(function(item){
                    console.log(item)
                    dict_items[item.id] = item                    
                })
                self.setState({ dict_items: dict_items })
                self.computeTotals()                
            })        
    }

    componentWillReceiveProps(nextProps, nextState){
        this.computeTotals(nextProps)
    }

    onMinusClick(e, item){
        e.preventDefault()
        let cart = this.props.cartInformation.cart
        if(cart[item.id] > 1){
            cart[item.id] -= 1
            this.props.setCartFilled(this.props.cartInformation.cartFilled - item.size)            
            this.props.addCart(cart)            
        }
    }

    onPlusClick(e, item){
        e.preventDefault()
        let cart = this.props.cartInformation.cart
        if(this.props.cartInformation.cartFilled < this.props.cartInformation.maxFilled){
            cart[item.id] += 1
            this.props.addCart(cart)
            this.props.setCartFilled(this.props.cartInformation.cartFilled + item.size)
        }     
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
                        <td><b>{item.title} (x{props.cartInformation.cart[item_key]}) 
                            <a id="plus"
                               onClick={(evt) => self.onMinusClick(evt, item).bind(self)}
                               className="quantity-change-btn" href="#">-</a> 
                            <a id="minus" 
                                onClick={(evt) => self.onPlusClick(evt, item).bind(self)}
                                className="quantity-change-btn" href="#">+</a></b></td>
                        <td><b>${item.price * props.cartInformation.cart[item_key]}</b></td>
                    </tr>                       
            )
            subtotal += Math.round((item.price * props.cartInformation.cart[item_key]) * 100)/100
        })
        commission = Math.round( (commission + (subtotal * 0.1)) * 100)/100

        this.setState({ subtotal: subtotal, items: items, total: Math.round( (subtotal + commission) * 100)/100, commission: commission })
    }

    onChange(change){
        console.log(change)
    }

    createBuyerAndMatchAndOrders(){
        var self = this
        this.props.stripe.createToken({type: 'card', name: self.props.userInformation.email}).then(({token}) => {
            console.log(token)
            axios({
                method: 'post',
                url: config.api_url + '/buyers',
                data: {
                    stripe_token: token,
                    user_id: self.props.userInformation.id
                }
            })
                .then(function(buyer_response){
                    console.log('created buyer', buyer_response.data)
                    self.props.loginUser(buyer_response.data)
                    // create match
                    axios({
                        method: 'post',
                        url: config.api_url + '/matches',
                        data: {
                            trip_id: self.props.tripsInformation.selected_trip.id
                        }
                    })
                        .then(function(match_response){
                            // create orders
                            console.log('created match', match_response.data)
                            console.log(Object.keys(self.props.cartInformation.cart))
                            // create orders for each item in cart
                            Object.keys(self.props.cartInformation.cart).forEach(function(item){
                                console.log('ITEM', item)
                                for(var i = 0 ; i < self.props.cartInformation.cart[item]; i++){
                                    axios({
                                        method: 'post',
                                        url: config.api_url + '/orders',
                                        data: {
                                            item_id: item,
                                            buyer_id: buyer_response.data.buyer.id,
                                            match_id: match_response.data.id
                                        }
                                    })
                                        .then(function(order_response){
                                            console.log('created order', order_response)
                                        })
                                }
                            })
                            let alert = (<Alert 
                                color="success">
                                    Your order has been placed!
                                </Alert>)
                            self.props.setAlert(alert)
                            self.props.hideCart(true)
                            self.props.hideReceipt(false)                            
                        })

                })
        });                
    }

    createMatchAndOrders(){
        var self = this
        // create match
        axios({
            method: 'post',
            url: config.api_url + '/matches',
            data: {
                trip_id: self.props.tripsInformation.selected_trip.id
            }
        })
            .then(function(match_response){
                // create orders
                console.log('created match', match_response.data)
                console.log(Object.keys(self.props.cartInformation.cart))
                // create orders for each item in cart
                Object.keys(self.props.cartInformation.cart).forEach(function(item){
                    console.log('ITEM', item)
                    for(var i = 0 ; i < self.props.cartInformation.cart[item]; i++){
                        axios({
                            method: 'post',
                            url: config.api_url + '/orders',
                            data: {
                                item_id: item,
                                buyer_id: self.props.userInformation.buyer.id,
                                match_id: match_response.data.id
                            }
                        })
                            .then(function(order_response){
                                console.log('created order', order_response)
                            })
                    }
                })
                let alert = (<Alert 
                    color="success">
                        Your order has been placed! Follow Next Steps to get in touch
                        with your Traveller and get your items.
                    </Alert>)
                self.props.setAlert(alert)
                self.props.hideCart(true)
                self.props.hideReceipt(false)                            
            })
    }


    onPlaceOrder(e){
        e.preventDefault()
        var self = this
        console.log(self.props.userInformation.email)
        if(! self.props.userInformation.buyer ){
            this.createBuyerAndMatchAndOrders()        
        } else {
            this.createMatchAndOrders()
        }

    }


    render() {
        let stripeInput = (
                                <div>Pay with your credit card via Stripe. <br/><br/>
                    <div style={{ border: "1px solid #961f47", borderRadius: "4px", padding: "10px", width: "500px", margin: "auto"}}>
                        <CardElement onChange={this.onChange.bind(this)} style={{ base: { fontSize: "18px"}}} />                        
                    </div></div>
        )
        if(this.props.userInformation.buyer != undefined){
            stripeInput = <div>* Payment information has already been saved from previous orders! <br/></div>
        }
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
                <form onSubmit={this.onPlaceOrder.bind(this)}>
                    { stripeInput }
                <br/>
                <Button style={{width: "275px"}} 
                    id="checkout-btn">Place Order</Button>
                </form>


                    
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInformation: state.userInformation,
        tripsInformation: state.tripsInformation,
        cartInformation: state.cartInformation
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addCart: (cart) =>{
      dispatch(addCart(cart))
    },
    setCartFilled: (cartFilled) => {
      dispatch(setCartFilled(cartFilled))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(Cart));