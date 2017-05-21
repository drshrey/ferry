import React, { Component } from 'react';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';

import '../index.css';
import './Shop.css';

class Shop extends Component {
  render() {
    return (
      <div className="Shop">
          <div className="main">
              <Header />
              <br/>
              <BigText text="Shop" />
          </div>
      </div>
    );
  }
}

export default Shop;
