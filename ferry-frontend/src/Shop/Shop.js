import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTrips } from '../actions'

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
      city: 1,
      alert: '',
      cities: []
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);    
    
    var self = this
    
    axios({
      method: 'get',
      url: config.api_url + '/cities'
    })
      .then(function(response){
        console.log(response.data)
        let cities = []
        response.data.forEach(function(city){
          cities.push(<option value={city.id}>{city.name},{city.country}</option>)
        })
        self.setState({ cities: cities })
      })
  }

  onClick(){
    var self = this
    // this.props.router.push('/catalog?country=' + this.state.country)
    let traveller_id = -1

    if('traveller' in self.props.userInformation && self.props.userInformation.traveller != null){
      traveller_id = self.props.userInformation.traveller.id
    }
    axios({
      method: 'POST',
      url: config.api_url + '/shop',
      data: {
        'city': self.state.city,
        'traveller_id': traveller_id
      }
    })
      .then(function(response){
        let trips = response.data.trips
        
        if(trips.length > 0){

          //add trips to redux store
          self.props.addTrips(trips)

          self.props.router.push('/catalog?city=' + response.data.city.name)
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
      <div>
          <div className="main Shop">
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
                  { this.state.cities }
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

const mapDispatchToProps = (dispatch) => {
  return {
    addTrips: (trips) => {
      dispatch(addTrips(trips))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
