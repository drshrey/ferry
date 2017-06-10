import React, { Component } from 'react';
import { connect } from 'react-redux';

import airplaneLogo from '../static/travel.svg';
import houseLogo from '../static/shop.svg';

import '../static/css/homepage.css';
import './App.css';

import Header from './Header/Header.js';
import BigText from './BigText/BigText.js';
import SmallText from './SmallText/SmallText.js';
import LogoLink from './LogoLink/LogoLink.js';
import Footer from './Footer/Footer.js';

import { CardDeck } from 'reactstrap';

class App extends Component {
	
	constructor(props){
		super(props)
	}

	componentDidMount(){
		document.title = "Ferry Homepage"
	}
	
  render() {
		if(this.props.userInformation.email){
			this.props.router.push('/dashboard')	
		}
    return (
      <div className="App">
      	<div className="main">
        	<Header />
        	<br/>
        	<br/>
        	<BigText text="FERRY CONNECTS YOU WITH RELIABLE TRAVELLERS HEADED TO COSTA RICA." />
        	<br/>
        	<SmallText text="Get what you need. Where you need it." />
        	<div className="who-are-you">
						<CardDeck>
							<LogoLink href="/travel" source={airplaneLogo} label="Travel" />
							<LogoLink href="/shop" source={houseLogo} label="Shop" />
						</CardDeck>
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
export default connect(mapStateToProps)(App);

