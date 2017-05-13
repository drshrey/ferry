import React, { Component } from 'react';
import Header from '../Header/Header.js';
import BigText from '../BigText/BigText.js';

import './Dashboard.css';

import '../index.css';

class Dashboard extends Component {
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

export default Dashboard;
