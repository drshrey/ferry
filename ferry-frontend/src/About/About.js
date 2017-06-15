import React, { Component } from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Row, Col } from 'reactstrap';
import BigText from '../BigText/BigText';

import './About.css';

class About extends Component {
  render() {
    return (
      <div className="AccountOrders">
          <div className="main About">
              <Header />
              <br/>
              <div className="AboutContent">
                <BigText text="About Us"/>
                <br/>
                <Row>
                    <Col sm={11}>
                        Ferry uses the infrastructure of the human network to allow 
                        international delivery to underserved markets. 
                        Today we are in an open beta and are focused on 
                        serving customers in Costa Rica and travellers 
                        coming from the United States.                    
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={11}>
                        <BigText 
                            style={{ fontSize: "30px", color:"#2e315b"}} 
                            text="Customers"/>                    
                    </Col>
                </Row>
                <br/>
                <Row>
                    
                    <Col sm={11}>
                        <div className="small-header"> Match </div><br/>
                        
                        In some parts of the world it’s impossible to buy 
                        anything online. We match you with someone headed your way to deliver
                        select items from Amazon with more retailers soon to come.
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={11}>                                    
                    <div className="small-header"> Fly </div>
                    <br/>
                    Ferry connects travelers to folks in countires that are 
                    under served by traditional ecommerce companies and shipping networks. 
                    Every traveler is verified and every package insured.                    
                    </Col>         
                </Row>
                <br/>

                <Row>
                    <Col sm={11}>
                        <div className="small-header"> Meet </div>
                        <br/>
                        Meet your match at a predetermined location to receive your 
                        package. Our goal is to provide end-to-end delivery services 
                        by the early 2018.
                    </Col>                           
                </Row>
                
                <br/>

                <Row>
                    <Col sm={11}>
                        <BigText 
                            style={{ fontSize: "30px", color:"#2e315b"}} 
                            text="Travellers"/>                    
                    </Col>
                </Row>
                <br/>
                <Row>
                    
                    <Col sm={11}>
                        <div className="small-header"> Book </div><br/>
                        
                        Book your trip and let us know when and where you’re headed! 
                        We’ll take care of matching you with someone in that city who needs something.
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={11}>                                    
                    <div className="small-header"> Receive </div>
                    <br/>
                        At least a week before your trip, you’ll receive a 
                        package from Amazon with everything you need to pack. 
                        We’ll also send you a reminder text to pack your bags!                   
                    </Col>         
                </Row>
                <br/>

                <Row>
                    <Col sm={11}>
                        <div className="small-header"> Drop-Off </div>
                        <br/>
                        Coordinate a drop-off location through our 
                        simple chat interface and once you’re confirmed, get paid!
                    </Col>                           
                </Row>
                
                <br/> 
                <br/> <br/> <br/> <br/> <br/> <br/>                                
                
              </div>
          </div>
          <Footer />
      </div>
    );
  }
}

export default About;
