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
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>                            
                            </Input>
                        </Col>                                              
                    </FormGroup>                    
               
                </Form>          
              </div>
            <br/>
            <br/>
            <Row>
            <Col sm={6}>
             <Button className="member-back" onClick={this.props.onBackClick} size="lg"> Back </Button>
            </Col>                
            <Col sm={6}>
             <Button className="member-next" onClick={this.props.onNextClick} size="lg"> Next </Button>
            </Col>
            </Row>                    
        </div>
    );
  }
}

export default ShippingInformation;
