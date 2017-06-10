import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import FerryInput from '../FerryInput/FerryInput';
import Footer from '../Footer/Footer';

import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavLink, NavItem, Button, CardHeader, CardBlock, Input, Col, Row, FormGroup, Card, CardTitle, CardText } from 'reactstrap';

import '../account.css';
import './AccountTravel.css';

class AccountTravel extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      activeTab: '1'
    }
    this.toggle = this.toggle.bind(this);
  }
  
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <div className="AccountTravel">
          <div className="main">
              <Header />
              <br/>
              <AccountSidebar highlight="orders" />
             <div className="Content">
              <BigText text="My Traveller Settings" />
              <br/>               
          
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Your Address
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Your Past Trips
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    Your Bank Information
                  </NavLink>
                </NavItem>                
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <br/> 
                    <Card>
                      <CardHeader className="header">Verified</CardHeader>
                      <CardBlock>
                        <CardTitle> {this.props.userInformation.traveller.street_address}</CardTitle>
                        <CardText> {this.props.userInformation.traveller.state} {this.props.userInformation.traveller.zip_code}</CardText>
                        <CardText> <Button color="primary">Edit</Button></CardText>
                      </CardBlock>
                    </Card>  
                </TabPane>
                <TabPane tabId="2">

                </TabPane>
              </TabContent>    
            </div>
          </div>
              <Footer />                     
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}
export default connect(mapStateToProps)(AccountTravel);
