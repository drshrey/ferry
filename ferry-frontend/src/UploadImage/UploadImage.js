import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Alert, Button, Row, Col } from 'reactstrap';
import { config } from '../config.json';

import { addUserInformation } from '../actions';

import './UploadImage.css';
import 'bootstrap/dist/css/bootstrap.css';


class UploadImage extends Component {
  
  constructor(props){
      super(props)
      this.state = {
          imageFile: '',
          saveBtn: false,
          title: '',
          visible: true
      }
  }

  handleImage(e){
    let imageUrl = URL.createObjectURL(e.target.files[0]);
    var url = URL.createObjectURL(e.target.files[0]);
    console.log(e.target.files[0])
    var img = new Image();
    img.src = url;    
    this.setState({ imageFile: img, saveBtn: true, title:e.target.files[0].name })
  }

  cancel(e){
      this.setState({ imageFile: '', title: '', saveBtn: false })
  }

  updateProfilePicture(){
        if(this.state.imageFile){

            //convert image to base64
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.state.imageFile.height;
            canvas.width = this.state.imageFile.width;
            ctx.drawImage(this.state.imageFile, 0, 0);
            dataURL = canvas.toDataURL();       

            var self = this
            fetch(config.api_url + '/users/profile_picture', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.userInformation.id,
                img: dataURL,
                title: this.state.title
                })
            })
            .then(function(response){
            console.log(response)
            if( response.status >= 400 && response.status <= 500 ){
                response.text().then(res =>{
                self.setState({ saveBtn: false , msg: "Something went wrong.", color: "danger"})
                })
            }
            if( response.status >= 200 && response.status < 300 ){
                response.json().then(json =>{
                    self.props.updateUserInformation(json)
                    self.setState({ saveBtn: false, msg: 'New picture successfully set.', color: "success" })                    
                })
            }
        })
        .catch(function(){
            console.log('fucked')
            self.setState({ saveBtn: false, msg: 'Something went wrong with our server.', color: 'danger' })        
        })
        } else {
            self.setState({ saveBtn: false, msg: 'Try uploading this image again or a different one.', color: 'danger' })                    
        }
  }

  onDismiss(){
      this.setState({ visible: false })
  }  

  render() {
    // profile picture alert
    let alert = ""
    if(this.state.msg && this.state.color){
        alert = <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss.bind(this)}>{this.state.msg}</Alert>
    }

    let btn = (<span className="btn btn-default btn-file">
                    Upload new picture <input onChange={this.handleImage.bind(this)} type="file" color="secondary" accept="image/*" />        
                </span>)
    
    if(this.state.saveBtn){
        btn = (<div>
                <Button onClick={this.updateProfilePicture.bind(this)} className="btn btn-success btn-file" color="success">Set new picture</Button>
                <br/>
                <br/>
                <Button onClick={this.cancel.bind(this)} className="btn btn-danger btn-file" color="danger">Cancel upload</Button>
               </div>)
    }

    let image = <img className="ActualImage" src={this.state.imageFile.src}></img>
    console.log(this.props.userInformation)
    if(this.props.userInformation.profile_picture_url && !this.state.imageFile.src){
        image = <img className="ActualImage" src={"data:image/png;base64," + this.props.userInformation.profile_picture_url}></img>
    }

    return (
      <div className="UploadImage">
        <Row>
            <Col>
                <b>Profile Picture</b>
                <div className="Image">
                    {image}
                </div>
            </Col>
        </Row>
        <br/>
        <Row className="Button">
            <Col>
                { btn }
            </Col>
            <br/>
            <br/>
                { alert }                            
        </Row>

      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInformation: (userInfo) => {
      dispatch(addUserInformation(userInfo))
    }
  }
}

const mapStateToProps = (state) => {
  return { userInformation: state.userInformation }
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadImage);

