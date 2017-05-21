import React, { Component } from 'react';

import airplaneLogo from '../static/airplane.png';
import houseLogo from '../static/backpack.png';

import '../static/css/homepage.css';
import './App.css';

import Header from './Header/Header.js';
import BigText from './BigText/BigText.js';
import SmallText from './SmallText/SmallText.js';
import LogoLink from './LogoLink/LogoLink.js';

class App extends Component {

	componentDidMount(){
		document.title = "Ferry Homepage"
	}
	
  render() {
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
	        	<LogoLink href="/travel" source={airplaneLogo} text="I'm a traveller looking to make money on my next trip." />
	        	<LogoLink href="/shop" source={houseLogo} text="I'm a shopper wanting to buy things I can't get locally." />
        	</div>
        </div>
      </div>
    );
  }
}

export default App;
