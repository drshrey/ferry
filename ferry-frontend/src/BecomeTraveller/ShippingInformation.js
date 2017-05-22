import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import { Button, Row, Col, Progress, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import './BecomeTraveller.css';

class ShippingInformation extends Component {
  constructor(props){
      super(props)
      this.state = {
          percentageComplete: 0
      }
  }

  render() {
    return (
      <div className={this.props.className}>
          <div className="main ShippingInformation">
                <br/>
                <h4> Where do you want the packages shipped? </h4>
                <br/>
                <Form>
                    <FormGroup>
                        <Col>
                            <Label for="streetAddress">Street Address</Label>
                            <Input type="address" onChange={this.props.onStreetAddressChange} value={this.props.streetAddress} name="streetAddress" id="streetAddress" placeholder="123 Main St" />
                        </Col>                         
                    </FormGroup>         
                    <Form inline>
                        <FormGroup>
                        <Col sm={6}>
                            <Label for="city">City</Label>
                            <Input type="city" onChange={this.props.onCityChange} value={this.props.city} name="city" id="city" placeholder="New York" />
                        </Col>     
                        </FormGroup> {' '}                    
                    <FormGroup>
                        <Col sm={6}>
                            <Label for="zipCode">Zip Code</Label>
                            <Input type="zipCode" onChange={this.props.onZipCodeChange} value={this.props.zipCode} name="zipCode" id="zipCode" placeholder="10001" />
                        </Col>                         
                    </FormGroup>                                               
                    </Form>  
                    <br/>                               
                    <FormGroup>
                        <Col>
                        <Label for="state">State</Label>
                            <Input onChange={this.props.onStateChange} value={this.props.state} type="select" name="state" id="state">
                                <option value="Alabama">Alabama</option>
                                <option value="California">California</option>
                                <option>Idaho</option>
                            </Input>
                        </Col>                                              
                    </FormGroup>                    
               
                </Form>          
              </div>
            <br/>
            <br/>
            <Row>
            <Col sm={6}>
             <Button className="member-back" onClick={this.props.onBackClick} size="lg" color="primary"> Back </Button>
            </Col>                
            <Col sm={6}>
             <Button className="member-next" onClick={this.props.onNextClick} size="lg" color="primary"> Next </Button>
            </Col>
            </Row>                    
        </div>
    );
  }
}

export default ShippingInformation;
