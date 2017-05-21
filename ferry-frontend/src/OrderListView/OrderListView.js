import React, { Component } from 'react';
import { Link } from 'react-router'; 
import SmallText from '../SmallText/SmallText';
import { Card, Button, CardTitle, CardText, CardBlock, Row, Col } from 'reactstrap';

import '../index.css';
import './OrderListView.css';

class OrderListView extends Component {
  render() {
    return (
      <div className="OrderListView"> 
        <Row>
        <Col sm="12">
            <Card outline color="primary">
                <CardBlock>
                    <CardTitle>San Francisco to Costa Rica</CardTitle>
                    <CardTitle>5/17/17 to 5/22/17</CardTitle>
                    <CardText>
                        <b>Traveller:</b> Matt Wosh <br/>
                        <b>Items:</b> Amazon Fire Stick, Apple iPhone 6
                    </CardText>
                    <Button color="primary">Chat</Button>{' '}
                    <Button color="info">In Transit</Button>
                </CardBlock>
            </Card>
        </Col>
        </Row>            
      </div>
    );
  }
}

export default OrderListView;
