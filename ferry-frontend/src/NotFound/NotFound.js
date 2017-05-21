import React, { Component } from 'react';
import BigText from '../BigText/BigText';
import Header from '../Header/Header';

import '../index.css'
import './NotFound.css';

class NotFound extends Component {
  render() {
    return (
      <div className="NotFound">
        <div className="main">
          <Header />
          <br/>
          <br/>
          <br/>
          <BigText text="404" />
          <BigText text="This page could not be found." />
        </div>
      </div>
    );
  }
}

export default NotFound;
