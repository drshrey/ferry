import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'; 

import SmallText from '../SmallText/SmallText';
import { Input, Card, Button, CardTitle, CardText, CardBlock, Row, Col } from 'reactstrap';
import axios from 'axios';

import config from '../config.json';


import '../index.css';
import './OrderListView.css';

class OrderListView extends Component {

  constructor(props){
    super(props)
    this.state = {
      arrival_date: '',
      departure_date: '',
      traveller_email: '',
      traveller_name: '',
      items: [],
      message: '',
      unsent_message: ''
    }
  }

  componentWillMount(){
    let arrival_date = ''
    let departure_date = ''

    let traveller_email = ''
    let traveller_name = ''
    let items = []

    let message = ''
    console.log(this.props)
    if(this.props.message != null || this.props.message != undefined){
      message = this.props.message
    }

    let idx = 1

    this.props.orders.forEach(function(order){
      arrival_date = order.match.trip.arrival_date
      departure_date = order.match.trip.departure_date

      traveller_email = order.user.email
      traveller_name = order.user.first_name
      let item = (<div><Row><Col> {idx}. {order.item.title}</Col></Row><br/></div>)
      items.push(item)
      idx += 1
    })
    this.setState({ message: message, traveller_name: traveller_name, items: items, arrival_date: arrival_date, departure_date: departure_date, traveller_email: traveller_email })
  }

  onMsgChange(e){
    this.setState({ unsent_message: e.target.value })
  }

  onSubmit(){
    var self = this
    axios({
      method: 'post',
      url: config.api_url + '/send',
      data: {
        buyer_name: self.props.userInformation.first_name,
        traveller_name: self.state.traveller_name,
        buyer_email: self.props.userInformation.email,
        traveller_email: self.state.traveller_email,
        message: self.state.unsent_message,
        match_id: self.props.match_id
      }
    })
      .then(function(response){
        self.setState({ message: self.state.unsent_message })
      })
  }

  render() {
    let message = <b>You haven't sent any messages yet.</b>
    let msgInput = (
        <Row>
          <Col sm={10}>
            <Input onChange={this.onMsgChange.bind(this)} type="textarea" style={{fontFamily: "Roboto Mono"}} placeholder="Send a message to Shreyas..." />
          </Col>
          <Col sm={2}>
            <Button 
              onClick={this.onSubmit.bind(this)}
              style={{ fontSize: "18px", color: "white", backgroundColor: "#961f47", border:"none", marginTop: "10px", fontFamily: "Roboto Mono"}}>
              Send
            </Button>
          </Col>          
        </Row>             
    )

    if(this.state.message != ''){
      message = <b>{this.state.message}</b>
      msgInput = (<div style={{ textAlign: "center"}}>
        Continue the conversation via email. <br/>
        Search for <i>{this.props.userInformation.first_name} and {this.state.traveller_name}  via Ferry</i> as the subject line.
        </div>)
    }


    return (
      <div className="OrderListView"> 
        <Row>
          <Col sm={5}>
            {this.state.arrival_date} - {this.state.departure_date}
          </Col>
          <Col sm={4}>
            Status: {this.props.status}
          </Col>     
          <Col sm={3}>
            <b><a href={"mailto:" + this.state.traveller_email}>{this.state.traveller_name}</a></b>
          </Col>                
        </Row>   
        <br/>  
        { this.state.items }
        <Row>
          <Col sm={12} style={{ textAlign: "center"}}>
            Your Message: { message }
          </Col>
        </Row>
        <br/>
        <hr/>
        { msgInput }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    userInformation: state.userInformation
  }
}

export default connect(mapStateToProps)(OrderListView);
