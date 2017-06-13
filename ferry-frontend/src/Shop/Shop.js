import React, { Component } from 'react';
import { connect } from 'react-redux';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { Alert, Row, Col, Input, Button } from 'reactstrap';
import axios from 'axios';
import config from '../config';

import '../index.css';
import './Shop.css';

class Shop extends Component {

  constructor(props){
    super(props)
    this.state = {
      city: 'Liberia',
      alert: ''
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);    
  }

  onClick(){
    var self = this
    // this.props.router.push('/catalog?country=' + this.state.country)
    axios({
      method: 'POST',
      url: config.api_url + '/shop',
      data: {
        'city': self.state.city,
        'traveller_id': self.props.userInformation.traveller.id
      }
    })
      .then(function(response){
        let trips = response.data
        
        if(trips.length > 0){
          self.props.router.push('/catalog?city=' + self.state.city)
        } else {
          let alert = (
            <Alert color="danger">
              There are currently no travellers going here.
              We'll notify you as soon as someone is travelling here. Thanks!
            </Alert>
          )
          self.setState({ alert: alert })
        }
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
                { this.state.alert }
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

const mapStateToProps = (state) => {
  return {
    userInformation: state.userInformation
  }
}

export default connect(mapStateToProps)(Shop);
