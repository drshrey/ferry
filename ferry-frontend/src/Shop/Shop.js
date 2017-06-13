import React, { Component } from 'react';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { Row, Col, Input, Button } from 'reactstrap';
import axios from 'axios';
import config from '../config';

import '../index.css';
import './Shop.css';

class Shop extends Component {

  constructor(props){
    super(props)
    this.state = {
      city: 'Liberia'
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);    
  }

  onClick(){
    var self = this
    // this.props.router.push('/catalog?country=' + this.state.country)
    axios({
      method: 'GET',
      url: config.api_url + '/shop/' + this.state.city,
    })
      .then(function(response){
        console.log(response)
        self.props.router.push('/catalog?city=' + self.state.city)
      })
  }

  onCountry(e){
    this.setState({ city: e.target.value })
  }

  render() {
    return (
      <div className="Shop">
          <div className="main">
              <Header />
              <br/>
              <br/>
              <Row>       
                <Col className="shop-col" sm={12}>
                <div className="shop"> Shop </div>
                <br/>
                <div className="question">Where do you live?</div>
                <br/>
                <Input 
                  style={{ fontSize: "18px", fontFamily: "Roboto Mono"}}
                  value={this.state.city}
                  onChange={this.onCountry.bind(this)} 
                  type="select" name="select" id="selectCountry">
                  <option value="Liberia">Liberia</option>
                  <option value="Tamarindo">Tamarindo</option>
                  <option value="San Jose">San Jose</option>
                  <option value="Limón">Limón</option>
                  <option value="Jacó">Jacó</option>
                </Input>
                <br/>
                <Button onClick={this.onClick.bind(this)} className="next">Next</Button>
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
