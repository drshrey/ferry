import React, { Component } from 'react';

import Header from '../Header/Header.js';
import BigText from '../BigText/BigText.js';
import { Button, Row, Col } from 'reactstrap';
import tickets from '../static/tickets.svg';
import deliver from '../static/deliver.svg';
import box from '../static/box.svg';


import './BecomeTraveller.css';

class GettingStarted extends Component {

  constructor(props){
    super(props)
  }

  onTravel(){
      this.props.router.push('/travel')
  }

  render() {
    return (
      <div className="GettingStarted">
          <div className="main">
            <Header />
            <br/>
            <BigText text="Getting Started" />
            <br/><br/>
            <Row>
                <Col id="earn-money" sm={11}>
                    Earn money on every trip you take!
                </Col>
            </Row>
            <br/>
            <Row>
                <Col sm={8} style={{ fontSize: "20px", fontFamily: "Roboto Mono", color: "#961f47"}}>
                    Headed on vacation and want to make
                    some extra money? We'll send you a 
                    package to take and drop off at your destination
                    airport. Easy as that.
                </Col>
            </Row>            
            <br/>
            <Row>
                <Col sm={11}>
                    <Button 
                        onClick={this.onTravel.bind(this)}
                        style={{ backgroundColor: "#961f47", color: "white", padding: "15px", fontFamily: "Roboto Mono"}}> 
                        Start Travelling 
                    </Button>
                </Col>
            </Row>
            <br/>
            <Row style={{ fontFamily: "Roboto Mono", color: "#2e315b", fontSize: "20px"}}>
                <Col sm={4}>
                    <img style={{width: "30px"}} src={tickets}></img>{' '}Book
                </Col>
                <Col sm={4}>
                    <img style={{width: "30px"}} src={box}></img>{' '}Receive
                </Col>
                <Col sm={4}>
                    <img style={{width: "30px"}} src={deliver}></img>{' '}Deliver
                </Col>                                
            </Row>
            <br/>
            <Row style={{ fontFamily: "Roboto Mono", color: "#961f47"}}>
                <Col sm={4}>
                Book your trip and let us know 
                when and where you're headed! We'll take 
                care of matching you with someone in that 
                city who needs something.
                </Col>
                <Col sm={4}>
                A week before your trip, you'll receive 
                a package with everything you need to pack. We'll 
                also send you a reminder text to pack your bags.
                </Col>
                <Col sm={4}>
                Chat with your shopper and decide where you want to meet
                to drop-off the package. Once you're in town, hand it over
                and get paid.
                </Col>                                
            </Row>
            <br/>
            <hr/>

          </div>
      </div>
    );
  }
}


export default GettingStarted;
