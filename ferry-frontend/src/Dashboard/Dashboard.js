import React, { Component } from 'react';
import Header from '../Header/Header.js';
import BigText from '../BigText/BigText.js';
import Footer from '../Footer/Footer.js';

import {connect} from 'react-redux';
import { Link } from 'react-router';
import { Alert, Row, Card, CardDeck, Col, CardText, CardTitle, Button, CardImg, CardSubtitle, CardBlock } from 'reactstrap';

import './Dashboard.css';

import '../index.css';

class Dashboard extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className="Dashboard">         
        <div className="main">
        <Header />        
        <br/>
        <Alert color="success" className="alert">We see that you're not a traveller yet. <Link to="become-traveller">Click here to become a traveller.</Link> Otherwise, dismiss this notification.
        </Alert>
        <Alert color="warning" className="alert"><Link to="become-traveller">Click here to validate yourself as a buyer.</Link></Alert>
        <Row>
          <Col sm={9}>
            <h2> Trip History: </h2>
            <CardDeck>                                             
            </CardDeck>
          </Col>
          <Col sm={3}>
            <h2> Payout: </h2>
            <Card block inverse color="primary">
              <CardTitle>$5,670</CardTitle>
              <CardText><b>2017 Year:</b> $3,182</CardText>              
              <CardText><b>May:</b> $1,325</CardText>
              <Button color="secondary">Learn More</Button>
            </Card>            
          </Col>          
        </Row>
        <br/>
        <br/><br/>
        <Row>       
          <Col sm={7}>
          <h2> Order History: </h2>   
            <CardDeck>                                        
            </CardDeck>
          </Col>
          <Col sm={5}>
            <h2> Featured Items: </h2>
            <CardDeck className="featured-items">             
                <Card block outline color="success">
                  <CardImg top width="100%" src="https://images-na.ssl-images-amazon.com/images/G/01/kindle/dp/2016/489468135/CC-FireTV-Stick-FireTVStick.v4._CB533756956_.png" alt="Card image cap" />
                  <CardBlock>
                    <CardTitle>Amazon Fire Stick</CardTitle>
                    <CardSubtitle>$129.99</CardSubtitle>
                    <CardText>
                      Watch TV or whatever
                    </CardText>
                    <Button>Buy</Button>
                  </CardBlock>
                </Card>
                <Card block outline color="success">
                  <CardImg top width="100%" src="https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/quietcomfort_25_acoustic_noise_cancelling_headphones-apple_devices/product_silo_images/qc25_apple_black_EC_hero_010716.psd/_jcr_content/renditions/cq5dam.web.320.320.png" alt="Card image cap" />
                  <CardBlock>
                    <CardTitle>Bose Headphones</CardTitle>
                    <CardSubtitle>$349.99</CardSubtitle>
                    <CardText>
                    Listen to some music shit.
                    </CardText>
                    <Button>Buy</Button>
                  </CardBlock>
                </Card>                                                         
            </CardDeck>            
          </Col>           
        </Row>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}

export default connect(mapStateToProps, null)(Dashboard);
