import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';
import Footer from '../Footer/Footer';

import OrderListView from '../OrderListView/OrderListView';
import {CardDeck} from 'reactstrap';

import config from '../config.json';

import '../account.css';
import './AccountOrders.css';

class AccountOrders extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      matches: []
    }
  }

  componentWillMount(){
    var self = this

    // there are many orders in a match 
    axios({
      method: 'post',
      url: config.api_url + '/orders/list',
      data: {
        user_id: this.props.userInformation.id
      }
    })
      .then(function(response){
        console.log(response.data)
        let matches = []
        Object.keys(response.data).forEach(function(match_id){
          let match = response.data[match_id]
          let view_match = (
            <OrderListView orders={match.orders} status={match.status} match_id={match.id} message={match.first_msg} />
          )
          matches.push(view_match)
          
        })
        self.setState({ matches: matches })
      })
  }
  
  render() {
    return (
      <div>
          <div className="main AccountOrders">
              <Header />
              <br/>
              <AccountSidebar highlight="orders" />
             <div className="Content">
                <BigText text="Orders & Returns" />
                <br/>
                Today, Ferry doesn't accept returns given the 
                complicated nature of our product shipping. That
                being said, we'll evaluate any issues you have
                with your traveller or product to make sure you
                have the best possible experience.
                <br/>
                <br/>
                { this.state.matches }
                <br/>
                <br/>
                <br/>
            </div>
          </div>
          <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInformation: state.userInformation
  }
}

export default connect(mapStateToProps)(AccountOrders);
