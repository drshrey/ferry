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
    this.state = {
      visible: true
    }
  }

  onDismiss(){
    this.setState({ visible: !this.state.visible })
  }

  render() {

    let travelAlert = ''
    if (! this.props.userInformation.traveller ) {
        travelAlert = (<Alert color="success" className="alert" isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>We see that you're not a traveller yet. <Link to="become-traveller">Click here to become a traveller.</Link> Otherwise, dismiss this notification.
                </Alert>);
    }
    return (
      <div className="Dashboard">         
        <div className="main">
        <Header />        
        <br/>
        { travelAlert }
        <br/>
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
        <br/>
        <br/>
        <br/>
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
