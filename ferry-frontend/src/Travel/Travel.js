import React, { Component } from 'react';
import { connect } from 'react-redux';

import BigText from '../BigText/BigText.js';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';

import '../index.css';
import './Travel.css';

class Travel extends Component {
  constructor(props){
    super(props)
  }

  render() {
    console.log(this)
    if( !this.props.userInformation.traveller){
      this.props.router.push('/become-traveller')
    }

    return (
      <div className="Travel">
          <div className="main">
              <Header />            
              <br/>              
              <h3> Add a Trip </h3>
              <h3> Your Trips </h3>
          </div>
          <Footer />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}
export default connect(mapStateToProps)(Travel);
