import React, { Component } from 'react';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import './Travel.css';

import '../index.css';

class Travel extends Component {
  render() {
    return (
      <div className="Travel">
          <div className="main">
              <Header loggedIn={true} />
              <br/>
              <BigText text="Travel" />
          </div>
      </div>
    );
  }
}

export default Travel;
