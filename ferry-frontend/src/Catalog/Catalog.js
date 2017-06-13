import React, { Component } from 'react';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { Progress, Row, Col, Input, Button } from 'reactstrap';

import phone from '../static/phone.png';
import phone2 from '../static/phone2.png';
import ipad from '../static/ipad.png';

import '../index.css';
import './Catalog.css';

class Shop extends Component {

  constructor(props){
    super(props)
    this.state = {
        city: '',
        cartFilled: 0,
        category: 'electronics'
    }
  }

  componentWillMount(){
    window.scrollTo(0, 0);
    const search = this.props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    console.log(search, params)
    
    const city = params.get('city'); // city
    this.setState({ city:  city }) 
  }

  onCategory(e){
    this.setState({ category: e.target.value })
  }

  render() {
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
                    <Progress value={this.state.cartFilled} />                                
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
                <Col>
                    <Input value={this.state.category} onSelect={this.onCategory.bind(this)} type="select" name="select" id="selectCategory">
                        <option value="electronics">Electronics</option>
                        <option value="apparel">Apparel</option>
                    </Input>                    
                </Col>
              </Row>    
              <br/> 
              <Row>
                <Col>
                    <span className="featured-products">Featured Products</span>
                </Col>
              </Row>  
              <br/>
              <Row>
                <Col sm={4}>
                    <img src={phone}></img><br/>
                    <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                        $99<br/>
                        <span style={{ color: "#961f47"}}>iPhone 7</span> <br/>
                        <Button className="add-to-cart">Add to Cart</Button><br/>
                        <span style={{ fontSize: "12px", color: "#961f47"}}>Lorem ipsum dolor text for describing.</span>
                    </div>
                </Col>
                <Col sm={4}>
                    <img src={phone2}></img>
                    <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                        $99<br/>
                        <span style={{ color: "#961f47"}}>Samsung Phone</span> <br/>
                        <Button className="add-to-cart">Add to Cart</Button><br/>
                        <span style={{ fontSize: "12px", color: "#961f47"}}>Lorem ipsum dolor text for describing.</span>
                    </div>                    
                </Col>
                <Col sm={4}>
                    <img src={ipad}></img>
                    <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                        $99<br/>
                        <span style={{ color: "#961f47"}}>iPad</span> <br/>
                        <Button className="add-to-cart">Add to Cart</Button><br/>
                        <span style={{ fontSize: "12px", color: "#961f47"}}>Lorem ipsum dolor text for describing.</span>
                    </div>                    
                </Col>                                
              </Row>  
              <br/>
              <br/>   
              <Row>
                <Col sm={4}>
                    <img src={phone}></img><br/>
                    <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                        $99<br/>
                        <span style={{ color: "#961f47"}}>iPhone 7</span> <br/>
                        <Button className="add-to-cart">Add to Cart</Button><br/>
                        <span style={{ fontSize: "12px", color: "#961f47"}}>Lorem ipsum dolor text for describing.</span>
                    </div>
                </Col>
                <Col sm={4}>
                    <img src={phone2}></img>
                    <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                        $99<br/>
                        <span style={{ color: "#961f47"}}>Samsung Phone</span> <br/>
                        <Button className="add-to-cart">Add to Cart</Button><br/>
                        <span style={{ fontSize: "12px", color: "#961f47"}}>Lorem ipsum dolor text for describing.</span>
                    </div>                    
                </Col>
                <Col sm={4}>
                    <img src={ipad}></img>
                    <div style={{marginLeft: "15px", fontFamily: "Roboto Mono"}}>
                        $99<br/>
                        <span style={{ color: "#961f47"}}>iPad</span> <br/>
                        <Button className="add-to-cart">Add to Cart</Button><br/>
                        <span style={{ fontSize: "12px", color: "#961f47"}}>Lorem ipsum dolor text for describing.</span>
                    </div>                    
                </Col>                                
              </Row>                                                                  
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

export default Shop;