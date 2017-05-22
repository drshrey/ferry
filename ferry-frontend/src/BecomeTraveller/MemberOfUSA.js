import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import { Row, Col, Progress, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';

import './BecomeTraveller.css';

class MemberOfUSA extends Component {
  constructor(props){
      super(props)
      this.state = {
          percentageComplete: 0
      }
  }
  render() {
    return (
      <div className={this.props.className}>
          <div className="main MemberOfUSA">
              <br/>
                <h4> Where do you live?</h4>                  
                <Form>
                    <FormGroup>
                        <Col>
                        <Label for="country">Country</Label>
                            <Input onChange={this.props.onCountryChange} value={this.props.country} size="lg" type="select" name="country" id="country">
                                <option >Alabama</option>
                                <option>California</option>
                                <option>Idaho</option>
                                <option value="United States of America">United States of America</option>
                            </Input>
                        </Col>                                              
                    </FormGroup>                    
                </Form>
            </div>
            <br/>
            <br/>
            <Row>
            <Col>
             <Button className="member-next" onClick={this.props.onNextClick} size="lg" color="primary"> Next </Button>
            </Col>
            </Row>            
      </div>
    );
  }
}

export default MemberOfUSA;
