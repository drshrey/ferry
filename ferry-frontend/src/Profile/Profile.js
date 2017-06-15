import React, { Component } from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AccountSidebar from '../AccountSidebar/AccountSidebar';
import UploadImage from '../UploadImage/UploadImage';
import config from '../config.json';
import FerryInput from '../FerryInput/FerryInput';
import FerrySubmit from '../FerrySubmit/FerrySubmit';
import SmallText from '../SmallText/SmallText';
import Error from '../Error/Error';

import { Card, Button, CardTitle, CardText, Col, CardDeck, Row, Alert } from 'reactstrap';

import { addUserInformation } from '../actions';

import './Profile.css';

class Profile extends Component {
  constructor(props){
      super(props)
      this.state = {
          first_name: this.props.userInformation.first_name,
          last_name: this.props.userInformation.last_name,
          email: this.props.userInformation.email,
          current_password: '',
          new_password: '',
          visible: true,
          updateError: false,
          updateSuccess: false,
          expiration_date: "",
          cvc: "",
          card_number: ""
      }
  }

  handleCardNumber(e){
      this.setState({ card_number: e.target.value })
  }

  handleExpirationDate(e){
      this.setState({ expiration_date: e.target.value })
  }

  handleCvc(e){
      this.setState({ cvc: e.target.value })
  }
                           
  componentDidMount(){
    document.title = "Ferry Profile"
  }
  
  handleFirstName(e){
    this.setState({ first_name: e.target.value })
  }

  handleLastName(e){
    this.setState({ last_name: e.target.value })
  }

  handleEmail(e){
    this.setState({ email: e.target.value })
  }  

  handleCurrentPassword(e){
    this.setState({ current_password: e.target.value })
  }  

  handleNewPassword(e){
    this.setState({ new_password: e.target.value })
  }      

  handleUpdateAccount(e){
      console.log(config)
      if(this.state.first_name && this.state.last_name && this.state.email){
        var self = this;
        fetch(config.api_url + '/users', {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            id: this.props.userInformation.id
          })
        })
        .then(function(response){
          console.log(response)
          if( response.status >= 400 && response.status <= 500 ){
            response.text().then(res =>{
               let msg = res
               self.setState({ visible: true, updateSuccess: false, updateError: true, msg: msg })               
            })
          }
          if( response.status >= 200 && response.status < 300 ){
            response.json().then(json =>{
                self.props.updateProfile(json)
                let msg = "Your account settings were successfully updated."
                self.setState({ visible: true, updateError: false, updateSuccess: true, msg: msg })
            })
          }
        })  

      } else {
          let msg = "All fields must be filled in before the account can be updated."
          this.setState({ visible: true, updateSuccess: false, updateError: true, msg: msg })
      }
  }

  onDismiss(){
      this.setState({ visible: false })
  }

  handleBecomeTraveller(){
    this.props.router.push('/become-traveller')
  }

  handleBecomeBuyer(){
      this.props.router.push('/become-buyer')
  }
  handleTravellerSettings(){
      this.props.router.push('/account/travel')
  }
  render() {
    let color = ""
    let msg = ""
    let alert = ""
    if(this.state.updateError){
        msg = this.state.msg
        color = "danger"
    }

    if(this.state.updateSuccess){
        msg = this.state.msg
        color = "success"
    }

    if(msg != "" && color != ""){
        alert = (<Alert color={color} isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>
            {msg
        }</Alert>)
    }
    // traveller
    let traveller = (<Card block outline color="danger">
        <CardTitle>Traveller</CardTitle>
        <CardText>Not Validated.</CardText>
        <br/>
        <Button color="primary" onClick={this.handleBecomeTraveller.bind(this)} > Become a traveller. </Button>
    </Card>)
    if( this.props.userInformation.traveller){
        traveller = (<Card block outline color="success">
            <CardTitle>Traveller</CardTitle>
            <CardText>Verified. You can add trips and carry items.</CardText>
            <Button color="secondary" onClick={this.handleTravellerSettings.bind(this)} > View Settings. </Button>
        </Card>)
    }

    return (
      <div className="Profile">
          <div className="main">
              <Header />
              <br/>
              <AccountSidebar highlight="profile" />
             <div className="Content">
                <Row>
                    <Col xs="<12></12>" sm="12">
                        <BigText text="My Account" />
                        <h5>{this.props.userInformation.first_name + ' ' + this.props.userInformation.last_name}</h5>
                        <br/>
                        <UploadImage />                        
                        <br/>
                        <h4 style={{fontFamily: "Roboto Mono", color: "#961f47"}}> Basic Information </h4>
                        <br/>
                        { alert }
                        <div className="name-input">
                            <FerryInput style={{ width: "150px" }} onChange={this.handleFirstName.bind(this)} label="First Name" placeholder="Enter your first name" value={this.state.first_name} />
                        </div>
                        <div className="name-input">
                            <FerryInput onChange={this.handleLastName.bind(this)} label="Last Name" placeholder="Enter your last name" value={this.state.last_name} />
                        </div>                
                        <br/>
                        <br/>
                        <FerryInput 
                            style={{ width: "430px" }}
                            onChange={this.handleEmail.bind(this)} label="Email" type="email" placeholder="Enter your email address" value={this.state.email} />                
                        <div className="update-account">
                            <Button style={{backgroundColor: "#961f47", color: "white", fontFamily: "Roboto Mono", width: "130px" }} onClick={this.handleUpdateAccount.bind(this)} color="secondary">Update </Button>                         
                        </div>
                        <br/>
                        <br/>

                        <h4 style={{fontFamily: "Roboto Mono", color: "#961f47"}}> Payment Settings </h4>
                        <p style={{ fontFamily: "Roboto Mono", color:" #941f47"}}>
                            Enter or update your payment information for all future orders.
                        </p>
                        <div className="name-input">
                            <FerryInput style={{ width: "280px" }} onChange={this.handleCardNumber.bind(this)} label="Card Number" placeholder="Enter your debit/ credit card number." value={this.state.card_number} />
                        </div>
                        <div className="name-input">
                            <FerryInput style={{ width: "140px"}} onChange={this.handleExpirationDate.bind(this)} label="Expiration Date" placeholder="05/19" value={this.state.expiration_date} />
                        </div>    
                        <div className="name-input">
                            <FerryInput style={{ width: "80px"}} onChange={this.handleCvc.bind(this)} label="CVC" placeholder="CVC" value={this.state.cvc} />
                        </div>   
                        <div className="update-account">
                            <Button style={{backgroundColor: "#961f47", color: "white", fontFamily: "Roboto Mono", width: "130px" }} onClick={this.handleUpdateAccount.bind(this)} color="secondary">Update </Button>                         
                        </div>                                                     

                        <br/>
                        <br/>
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (userInfo) => {
      dispatch(addUserInformation(userInfo))
    }
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
