import React, { Component } from 'react';
import { Link } from 'react-router'; 

import { Input, Label, FormGroup, Col, Row, Button, CardTitle, CardText, Card, CardDeck } from 'reactstrap';

import '../index.css';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <Row>
            <Col sm={4}>
            <br/>
                <Col sm={10}>
                <FormGroup>
                <Input type="select" name="select" id="languages">
                    <option>English</option>
                    <option>Spanish</option>
                </Input>
                </FormGroup>  
                <FormGroup>    
                <Input type="select" name="select" id="currency">
                    <option>USD</option>
                    <option>Pesos</option>
                </Input>
                </FormGroup>
                </Col>                   
            </Col>
          <Col sm={8}>          
        <CardDeck>            
                <Card className="footer-card" block>
                  <CardTitle>Ferry</CardTitle>
                  <CardText>
                    <Link className="footer-link" to="/">About Us</Link><br/>
                    <Link className="footer-link" to="/">Press</Link><br/>
                    <Link className="footer-link" to="/">Policies</Link><br/>
                    <Link className="footer-link" to="/">Help</Link>
                  </CardText>
                </Card>
                <Card className="footer-card" block>
                  <CardTitle>Shop</CardTitle>
                  <CardText>
                    <Link className="footer-link" to="/">About Us</Link><br/>
                    <Link className="footer-link" to="/">Press</Link><br/>
                    <Link className="footer-link" to="/">Policies</Link><br/>
                    <Link className="footer-link" to="/">Help</Link>
                  </CardText>
                </Card>
                <Card className="footer-card" block>
                  <CardTitle>Travel</CardTitle>
                  <CardText>
                    <Link className="footer-link" to="/">About Us</Link><br/>
                    <Link className="footer-link" to="/">Press</Link><br/>
                    <Link className="footer-link" to="/">Policies</Link><br/>
                    <Link className="footer-link" to="/">Help</Link>
                  </CardText>
                </Card>                                                     
            </CardDeck>            
          </Col>          
        </Row>
        <hr/>
        <Row>
            <Col className="ferry-footer-header" sm={9}>
                <h2> Ferry </h2>
            </Col>
            <Col sm={3}>
                <span className="footer-word"><Link className="footer-link" href="#">Terms</Link></span>
                <span className="footer-word"><Link className="footer-link" href="#">Privacy</Link></span>
                <span className="footer-word"><Link className="footer-link" href="#">Site</Link></span>
                <span className="footer-word"><Link className="footer-link" href="#">Map</Link></span>
            </Col>
        </Row>
        <br/>
      </div>
    );
  }
}

export default Footer;
