import React, { Component } from 'react';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { Row, Col, Input, Button } from 'reactstrap';

import '../index.css';
import './Shop.css';

class Shop extends Component {

  constructor(props){
    super(props)
    this.state = {
      country: 'liberia'
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);    
  }

  onClick(){
    this.props.router.push('/catalog?country=' + this.state.country)
  }

  onCountry(e){
    this.setState({ country: e.target.value })
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
                <Input value={this.state.country} onSelect={this.onCountry.bind(this)} type="select" name="select" id="selectCountry">
                  <option value="liberia">Liberia</option>
                  <option value="tamarindo">Tamarindo</option>
                  <option value="san jose">San Jose</option>
                  <option value="limon">Limón</option>
                  <option value="jaco">Jacó</option>
                </Input>
                <br/>
                <Button onClick={this.onClick.bind(this)} className="next">Next</Button>
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

export default Shop;
