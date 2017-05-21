import React, { Component } from 'react';
import Header from '../Header/Header.js';
import BigText from '../BigText/BigText.js';

import {connect} from 'react-redux';

import './Dashboard.css';

import '../index.css';

class Dashboard extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className="Dashboard">         
        <div className="main">
        <Header />        
        <br/>
        <BigText text="Dashboard" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}

export default connect(mapStateToProps, null)(Dashboard);
