import React, { Component } from 'react';

import airplaneLogo from '../static/images/airplane.png';
import houseLogo from '../static/images/backpack.png';

import '../static/css/homepage.css';
import './App.css';

import Header from './Header.js';
import BigText from './BigText.js';
import SmallText from './SmallText.js';
import Line from './Line.js';
import LogoLink from './LogoLink.js';

class App extends Component {
  render() {
    return (
      <div className="App">
      	<div className="main">
        	<Header />
        	<Line />        	
        	<br/>
        	<br/>
        	<BigText text="FERRY CONNECTS YOU WITH RELIABLE TRAVELLERS HEADED TO COSTA RICA." />
        	<br/>
        	<SmallText text="Get what you need. Where you need it." />
        	<div className="who-are-you">
	        	<LogoLink href="/travel" source={airplaneLogo} text="I'M A TRAVELLER HEADED TO MAKE MONEY ON MY NEXT TRIP." />
	        	<LogoLink href="/shop" source={houseLogo} text="I'M A SHOPPER LOOKING TO BUY THINGS I CAN'T GET LOCALLY." />
        	</div>
        </div>
      </div>
    );
  }
}

export default App;
