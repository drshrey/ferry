import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import SmallText from '../SmallText/SmallText.js';
import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import FerryInput from '../FerryInput/FerryInput.js';
import config from '../config.json';

import { Alert, Button, Row, Col, Input } from 'reactstrap';

import '../index.css';
import './Travel.css';

class Trip extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div className="Trip">
        Flying to {this.props.destination_city.name} | arriving { this.props.arrival_date}
          | departing { this.props.departure_date } | status: { this.props.status}
          | luggage capacity: { this.props.size }
      </div>
    )
  }
}

class Travel extends Component {
  constructor(props){
    super(props)
    this.state = {
      destination: 1,
      arrival: '',
      departure: '',
      size: 'Large',
      alert: '',
      past_trips: [],
      cities: []
    }
  }

  componentDidMount(){
    var self = this    
    axios({
      method: "GET",
      url: config.api_url + '/trips/' + this.props.userInformation.traveller.id
    })
      .then(function(response){
        console.log(response.data)
        
        // fill in past_trips variable

        let past_trips = []
        response.data.forEach(function(trip){
          console.log(trip)
          let past_trip = (
            <Trip 
              arrival_date={trip.arrival_date}
              destination_city={trip.destination_city}
              traveller={trip.traveller}
              departure_date={trip.departure_date}
              status={trip.status}
              size={trip.size}
            />       
          )
          past_trips.push(past_trip)
        })

        self.setState({ past_trips: past_trips })
      })


    axios({
      method: 'get',
      url: config.api_url + '/cities'
    })
      .then(function(response){
        console.log(response.data)
        let cities = []
        response.data.forEach(function(city){
          cities.push(<option value={city.id}>{city.name}, {city.country}</option>)
        })
        self.setState({ cities: cities })
      })      
  }  

  onDestination(e){
    this.setState({ destination: e.target.value })
  }

  onArrivalDate(e){
    this.setState({ arrival: e.target.value })
  }

  onDepartureDate(e){
    this.setState({ departure: e.target.value })
  }

  onSize(e){
    this.setState({ size: e.target.value })
  }

  addTrip(){
    if(this.state.departure != '' || this.state.arrival != ''){
      let departure = new Date(this.state.departure)
      let arrival = new Date(this.state.arrival)

      let min_date = new Date();  
      console.log(departure.getTime())
      console.log(min_date.getTime())
      console.log(arrival.getTime())

      console.log(departure.getTime() < min_date.getTime() && arrival.getTime() < min_date.getTime())

      if( departure.getTime() < min_date.getTime() || 
          arrival.getTime() < min_date.getTime() ){
        let alert = (<Alert color="danger">
            Please enter valid dates that are atleast 6 days from now.
        </Alert>)
        this.setState({ alert : alert })
      } else {
        if( departure.getTime() < arrival.getTime() ){
            let alert = (<Alert color="danger">
                Make sure the arrival date is before the departure date.
            </Alert>)
            this.setState({ alert : alert })        
        } else {
          this.setState({ alert : '' })

          var self = this

          // add a trip
          axios({
            method: 'POST',
            url: config.api_url + '/trips',
            data: {
              traveller_id: self.props.userInformation.traveller.id,
              destination: self.state.destination,
              size: self.state.size,
              arrival: self.state.arrival,
              departure: self.state.departure
            }
          })
            .then(function(response){
              console.log(response.data)
              let alert = (<Alert color="success">
                  Your trip has been successfully added! We'll let you 
                  know as soon as we find a match for it.
              </Alert>)
              self.setState({ alert : alert })      
            })

        }
      }
    } else {
      let alert = (<Alert color="danger">
          Please enter valid dates.
      </Alert>)      
      this.setState({ alert: alert })
    }
  }


  renderTrips(){
    return (
        <Row>
          <Col sm={12}>
            Flying to Liberia | arriving 06/18/2017 | departing 06/22/17 | No matches yet
          </Col>
        </Row>            
    )    
  }

  render() {
    console.log(this)
    console.log(this.state)
    if( !this.props.userInformation.traveller){
      this.props.router.push('/become-traveller')
    }

    return (
      <div className="Travel">
          <div className="main TravelInner">
              <Header />            
              <br/>              

              <Row>
                <Col>
                  <BigText text="Travel" />
                </Col>
              </Row>
              <br/>
              {this.state.alert}
              <SmallText text="Add a Trip" />
              <br/>
              <Row>
                <Col sm={4}>
                Destination City <br/>
                <Input 
                  style={{ width: "250px", fontSize: "16px", fontFamily: "Roboto Mono"}}
                  value={this.state.destination}
                  onChange={this.onDestination.bind(this)}
                  type="select" name="select" id="selectDestination">
                  { this.state.cities }
                </Input>
                </Col>
                <Col sm={3}>
                  <FerryInput 
                    onChange={this.onArrivalDate.bind(this)}
                    type="date" style={{width: "170px"}} label="Arrival Date" />
                </Col>                
                <Col sm={3}>
                  <FerryInput 
                    onChange={this.onDepartureDate.bind(this)}
                    type="date" style={{width: "170px"}} label="Departure Date" />
                </Col>                
              </Row>     
              <br/>         
              <Row>
                <Col sm={4}>
                Size <br/>
                <Input 
                  onChange={this.onSize.bind(this)}
                  style={{ width: "220px", fontSize: "18px", fontFamily: "Roboto Mono"}}
                  value={this.state.size}
                  type="select" name="select" id="selectDestination">
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </Input>                  
                </Col>
                <Col sm={4}>
                  <Button 
                    onClick={this.addTrip.bind(this)}
                    style={{ fontFamily: "Roboto Mono", marginTop: "32px", border: "1px solid #961f47", color : "white", backgroundColor: "#961f47"}}> 
                      Add Trip 
                  </Button>
                </Col>                
              </Row>
            <br/>
            <hr/>
            <br/>
            <SmallText text="Past Trips" />            
            <br/>                  
            { this.state.past_trips }
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
  return { userInformation: state.userInformation }
}
export default connect(mapStateToProps)(Travel);
