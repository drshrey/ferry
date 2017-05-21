import React, { Component } from 'react';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';

import '../index.css';
import './Travel.css';

class Travel extends Component {
  render() {
    return (
      <div className="Travel">
          <div className="main">
              <Header />
              <br/>
              <BigText text="Travel" />
          </div>
      </div>
    );
  }
}

export default Travel;
