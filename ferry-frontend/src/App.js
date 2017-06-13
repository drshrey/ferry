import React, { Component } from 'react';
import { connect } from 'react-redux';

import houseLogo from './static/shop.svg';
import airplaneLogo from './static/travel.svg';
import background from './static/background.png';

import meet from './static/meet.svg';
import buy from './static/buy.svg';
import fly from './static/fly.svg';

import './static/css/homepage.css';
import './App.css';

import Header from './Header/Header.js';
import BigText from './BigText/BigText.js';
import SmallText from './SmallText/SmallText.js';
import LogoLink from './LogoLink/LogoLink.js';
import Footer from './Footer/Footer.js';

import { Link } from 'react-router';
import { Col, Row, CardDeck } from 'reactstrap';

class App extends Component {
	
	constructor(props){
		super(props)
	}

	componentWillMount(){
		if(this.props.userInformation.email){
			if(this.props.userInformation.traveller != null){
				this.props.router.push('/travel')	
			} else {
				this.props.router.push('/shop')	
			}
		}
	}

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
        	<BigText style={{fontSize: "40px", width: "700px", color: "#961f47", fontFamily: "Roboto Mono"}} text="Ferry connects you with reliable travelers headed to Costa Rica." />
        	<br/>
        	<SmallText style={{width: "500px",fontSize: "20px", fontFamily: "Roboto Mono"}} text="Get what you’re looking for delivered to you by trusted travellers." />
        	<div className="who-are-you">
						<CardDeck>
							<LogoLink href="/travel" source={airplaneLogo} label="Travel" />
							<LogoLink href="/shop" source={houseLogo} label="Shop" />
						</CardDeck>
        	</div>
				</div>
				<div className="part2-app">
					<div className="inner-part2-app">
						<Row>
							<Col sm={7}>
									<span id="introducing-ferry">Introducing Ferry</span>
							</Col>
						</Row>
						<br/>
						<br/>
						<Row>
							<Col sm={8}>
									<span id="pitch">
											Ferry uses the infrastructure of the
											human network to allow international delivery to 
											underserved markets — starting in Costa Rica.										
									</span>
							</Col>
						</Row>	


						<Row>
							<Col sm={4}>
									<div className="header-logo">
										<img src={buy}></img>{' '}
										Buy
									</div>
									<span className="logo-pitch">
									We match you with someone headed your way to deliver select items from our shop.
									</span>
							</Col>
							<Col sm={4}>
									<div className="header-logo">
										<img src={fly}></img>{' '}Fly
									</div>
									<span className="logo-pitch ">
									Once you’ve made your order, we send it to your assigned traveller to bring to you.
									</span>
							</Col>
							<Col sm={4}>
									<div className="header-logo">
										<img src={meet} style={{width: "30px"}}></img>{' '}Meet
									</div>
									<span className="logo-pitch">
									Chat with the verified traveller to find a time to meet in your city and receive your package.
									</span>
							</Col>												
						</Row>			
						<br/>
						<br/>
						<Row>
							<Col sm={{ size: 6, push: 2, pull: 2, offset: 1 }}>
								<span id="get-started">Get Started</span>
							</Col>
						</Row>
						<br/>
						<Row>
							<Col style={{ textAlign: "center"}} sm={{ size: 5, push: 2, pull: 2, offset: 1 }}>
								<span style={{marginRight: "150px", display: "inline-block"}}>
									<img style={{width: "80px"}} src={airplaneLogo}></img>
									<span style={{display: "block"}}><Link style={{fontFamily: "Roboto Mono", color: "white"}} to="/travel">Travel</Link></span>									
								</span>

								<span style={{display: "inline-block"}}>
									<img style={{width: "80px"}} src={houseLogo}></img>
									<span style={{display: "block"}}><Link style={{fontFamily: "Roboto Mono", color: "white"}} to="/shop">Shop</Link></span>									
								</span>
								{/*<LogoLink 
								style={{display: "inline-block"}} 
								imageStyle={{ width: "70px"}} 
								labelStyle={{ display: "block", marginTop: "10px", marginLeft: "10px", fontSize: "13px"}} 
								labelClassName="white" 
								imageClassName="white" 
								href="/travel" source={airplaneLogo} label="Travel" />
								<LogoLink 
								style={{display: "inline-block"}} 
								imageStyle={{width: "70px"}}
								labelStyle={{ display: "block", marginTop: "10px", marginLeft: "20px", fontSize: "13px"}} 
								labelClassName="white" 
								imageClassName="white" 
								href="/shop" source={houseLogo} label="Shop" />														*/}
							</Col>					
						</Row>					
						<br/>
						<br/>
						<br/>						
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

