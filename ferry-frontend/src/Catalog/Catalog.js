import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addCart, setCartFilled, setMaxFilled } from '../actions'

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { Alert, Progress, Row, Col, Input, Button } from 'reactstrap';

import phone from '../static/phone.png';
import phone2 from '../static/phone2.png';
import ipad from '../static/ipad.png';

import '../index.css';
import './Catalog.css';

class Item extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <Col sm={4}>
                <img src={this.props.img}></img><br/>
                <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                    {this.props.price}<br/>
                    <span style={{ color: "#961f47"}}>{this.props.name}</span> <br/>
                    <Button className="add-to-cart" onClick={(evt) => this.props.onItemClick(evt, this.props.item_id)}>Add to Cart</Button><br/>
                    <span style={{ fontSize: "12px", color: "#961f47"}}>{this.props.description}</span>
                </div>
            </Col>                             
        )
    }
}

class Catalog extends Component {

  constructor(props){
    super(props)
    this.state = {
        city: '',
        categories: [],
        category: 'electronics',
        items: [],
        dict_items: {},
        cart: {},
        alert: ''
    }

  }

  componentWillMount(){
    window.scrollTo(0, 0);

    if(this.props.tripsInformation.trips.length == 0){
        this.props.router.push('/shop')
    }

    let selected_trip = {}
    let maxFilled = 0

    this.props.tripsInformation.trips.forEach(function(trip){        
        if(trip.size == 'small' && maxFilled <= 60){
            selected_trip = trip
            maxFilled = 60
        }
        if(trip.size == 'medium' && maxFilled <= 100){
            selected_trip = trip
            maxFilled = 100
        }

        if(trip.size == 'large' && maxFilled <= 120){
            selected_trip = trip
            maxFilled = 120
        }
    })
    
    this.props.setMaxFilled(maxFilled)    

    const search = this.props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    console.log(search, params)
    
    const city = params.get('city'); // city
    this.setState({ city:  city }) 

    let categories = []
    categories.push(<option value="electronics">Electronics</option>)
    categories.push(<option value="clothing">Clothing</option>)
    categories.push(<option value="homegoods">Home Goods</option>)
    this.setState({ categories: categories})


    // fill items in 
    let items = []
    let dict_items = {}

    let item = {
        img: phone,
        name: "iPhone 7",
        description: "iPhone 7 dramatically improves the most important aspects of the iPhone experience. It introduces advanced new camera systems.",
        id: 1,
        size: 20,
        price: "$699"
    }
    items.push(
    <Item 
        img={item.img}
        name={item.name}
        price={item.price}
        description={item.description}
        item_id={item.id}
        size={item.size}
        onItemClick={this.onItemClick.bind(this)}
        />)
    dict_items[item.id] = item

    this.setState({ items: items, dict_items: dict_items })
  }

  onItemClick(e, item_id){
      console.log(item_id)
      let item = this.state.dict_items[item_id]
      if(this.props.cartInformation.cartFilled < this.props.cartInformation.maxFilled){
        let newCart = this.state.cart
        let newItemCount = 1
        console.log(this.state.cart[item_id])
        if(this.props.cartInformation.cart[item_id] != undefined 
            && this.props.cartInformation.cart[item_id] != null){
            newItemCount = this.props.cartInformation.cart[item_id] + 1
        }
        
        newCart[item_id] = newItemCount
        this.props.addCart(newCart)
        this.props.setCartFilled(this.props.cartInformation.cartFilled + item.size)

      }

  }

  onCategory(e){
    console.log(e.target.value)
    this.setState({ category: e.target.value })
  }

  onCheckout(){
      console.log(this.state)
      if(Object.keys(this.props.cartInformation.cart).length > 0){
        this.props.router.push('/checkout')
      } else {
          let alert = <Alert color="danger">Please add atleast one item before proceeding to the checkout page.</Alert>
          this.setState({ alert: alert })
      }
  }

  onAlert(alert){
      this.setState({ alert: alert })
  }

  render() {
    console.log(this.state.cart)
    console.log(this.props.cartInformation)
    return (
      <div className="Catalog">          
          <div className="main">
              <Header />
              <br/>
              <br/>
              <Row>       
                  <Col sm={12}>
                    <span style={{fontFamily: "Roboto Mono"}} className="shop-header">Shop - {this.state.city}</span>
                  </Col>
              </Row>   
              <br/>           
              <Row>
                  <Col>
                    <Progress value={this.props.cartInformation.cartFilled} 
                        max={this.props.cartInformation.maxFilled} />                                
                  </Col>
              </Row>
              <br/>
              <Row>
                <Col>
                    <span className="match-traveller">
                        We’ve matched you with a Traveller! 
                        Remember though, your Traveller has limited space. 
                        As you shop, the bar above will represent the space left in your cart.                    
                    </span>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col sm={8}>
                    <Input value={this.state.category} onChange={this.onCategory.bind(this)} type="select" name="select" id="selectCategory">
                        { this.state.categories }
                    </Input>                    
                </Col>

                <Col sm={3}>
                    <Button id="checkout-btn"
                        onClick={this.onCheckout.bind(this)}
                        >Checkout</Button>
                </Col>                
              </Row>    
              <br/>
              <Row>
                <Col sm={11} style={{ fontFamily: 'Roboto Mono' }}>
                    { this.state.alert }
                </Col> 
              </Row>
              <br/> 
              <Row>
                <Col>
                    <span className="featured-products">Featured Products</span>
                </Col>
              </Row>  
              <br/>
              { this.state.items }  
              <br/>                                                                
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
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
      tripsInformation: state.tripsInformation,
      cartInformation: state.cartInformation
   }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addCart: (cart) => {
      dispatch(addCart(cart))
    },
    setCartFilled: (cartFilled) => {
        dispatch(setCartFilled(cartFilled))
    },
    setMaxFilled: (maxFill) => {
        dispatch(setMaxFilled(maxFill))
    },    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);