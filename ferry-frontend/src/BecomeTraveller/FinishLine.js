import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import { Row, Col, Progress, Form, FormGroup, Label, Input, FormText, Button} from 'reactstrap';

import './BecomeTraveller.css';

class FinishLine extends Component {
  constructor(props){
      super(props)
      this.state = {
          percentageComplete: 0
      }
  }
  render() {
    return (
      <div className={this.props.className}>
          <div className="main FinishLine">
              <br/>
                <h4> Thanks for filling this out!
                </h4>                  
                <h5>We're going to send you a confirmation email (once you submit). 
                    You can then start adding trips, and start receiving payments for your trip transactions.
                    Have fun and if you ever have any questions, you can always send us an email
                    at support@getferry.com.
                </h5>
                <FormText> You can read the Terms and Conditions <a href="#">here</a>. </FormText>
                <br/>
                
                <Col sm={{ size: 12 }}>
                    <FormGroup check>

                    <Label check>
                        <Input type="checkbox" id="terms" />{' '}
                        I accept the Terms and Conditions
                    </Label>
                    </FormGroup>
                </Col>
            </div>
            <br/>
            <br/>
            <Row>
            <Col sm={3}>
             <Button className="member-back" onClick={this.props.onBackClick} size="lg" color="primary"> Back </Button>
            </Col>                
            <Col sm={6}>
             <Button className="member-submit" onClick={this.props.onSubmitClick} size="lg" color="success"> Submit </Button>
            </Col>
            </Row>                
      </div>
    );
  }
}

export default FinishLine;
