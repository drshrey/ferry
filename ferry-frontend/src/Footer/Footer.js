import React, { Component } from 'react';
import { Link } from 'react-router'; 

import Line from '../Line/Line';
import { Input, Label, FormGroup, Col, Row, Button, CardTitle, CardText, Card, CardDeck } from 'reactstrap';

import instagram from '../static/instagram.svg';
import facebook from '../static/facebook.svg';
import twitter from '../static/twitter.svg';

import '../index.css';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <Line />
        <br/>
        <Row>
          <Col sm={2}>
            <span className="footer-link">
              <Link to="/about">About Us</Link>
            </span>          
          </Col>

          <Col sm={2}>
            <span className="footer-link">
              <Link to="/careers">Careers</Link>
            </span>
          </Col>

          <Col sm={5}>
            <span className="footer-link">
              <Link to="/trust">Trust & safety</Link>
            </span>          
          </Col>    
          <Col sm={1}>
            <span className="footer-link">
              <img src={facebook}></img>
            </span>          
          </Col>    
          <Col sm={1}>
            <span className="footer-link">
              <img src={twitter}></img>
            </span>          
          </Col>    
          <Col sm={1}>
            <span className="footer-link">
              <img src={instagram}></img>
            </span>          
          </Col>                                                  
        
        </Row>
      </div>
    );
  }
}

export default Footer;
