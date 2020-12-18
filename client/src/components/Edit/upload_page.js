import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import { Progress } from 'reactstrap';
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import Profile from '../Profile';
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";
import {
  Card, Button, CardImg, CardTitle, CardText, CardDeck,
  CardSubtitle, CardBody, CardLink
} from 'reactstrap';


class UploadPage extends Component {
  constructor(props) {
    super(props);
  this.roundToTenth = this.roundToTenth.bind(this);
  this.fetchData = this.fetchData.bind(this);
  this.fetchDataUsage = this.fetchDataUsage.bind(this);
  this.sendEmailValidation = this.sendEmailValidation.bind(this);

 
    this.state = {
      dataUsage: null,
      percentage: null,
      subStatus: false,
      disabled: false,
      upgrade: false
    };
 
  }


  componentDidMount() {
    let email_verified = this.context.user.email_verified;
    this.fetchData()
  }

  roundToTenth = (num) => {
    this.setState({ dataUsage : Math.ceil(num * 100) / 100 });
    console.log(this.state.dataUsage)
  }

  fetchData = async () => {
    try {
     let user_id = this.context.user.sub;
     const response = await axios.get(`https://www.hiphopvolume.com/get-premium-user/${user_id}`);
     console.log(response)
     if (response.status == 200) {
     if (response.data[0] && response.data[0].status == 'active') {
      this.setState({subStatus: true}) 
        this.fetchDataUsage(80)
      } else {
        this.fetchDataUsage(0.3)
      }
     }
      } catch(err) {
        console.log(err)
      }
  }

  fetchDataUsage = (gb) => {
    try {
     let user_id = this.context.user.sub;
     fetch(`/dataUsage/${user_id}`)
      .then((response) =>
      response.json())
    .then((data) => {
      console.log(JSON.stringify(data))
      if (data.overFree) {
         console.log(true)
         this.setState({disabled: true})
         this.setState({upgrade: true}) 
      }
      if (data.overPremium) {
        this.setState({disabled: true})
      }
      this.roundToTenth(data.size)
      this.setState({ percentage : data.size / gb * 100});
      console.log("data" + data)
        }).catch((error) => {
          console.log("Error " + error)
        })
    } catch(err) {
      console.log(err)
    }
  }

  sendEmailValidation = async () => {
    let user_id = this.context.user.sub;
    try {
    const emailValidation = await axios.post('/emailVerification', {'user_id': user_id});
    alert('Email Sent')
    console.log(emailValidation)
    } catch(err) {
      console.log(err.response)
      if (err.response.status == 429) {
        alert(err.response.data)
      }
    }
  }





  
  render() {
    console.log(this.context)
    if (this.context) {
    if (!this.context.user.email_verified) {
      return(
       <div style={{marginTop:"20px", marginLeft:"auto", marginRight:"auto", textAlign:"center"}}>
       <h3>Please verify your email before uploading content</h3><Button className="resendEmail" outline color="primary" onClick={this.sendEmailValidation}>Resend Email</Button>
       <p>or</p>
       <Button className="resendEmail" outline color="primary" onClick={() => window.location.reload(false)}>Done. Reload</Button>
       </div>
      )
    } else {
    return (

 
      <div className="upload_page">
      <div className="progress">
      <Progress striped value={this.state.percentage}/>
      </div>
      <div className="gigs" style={{marginLeft:"auto", marginRight:"auto", textAlign:"center"}}>
      {this.state.subStatus ? (
      <h6>{this.state.dataUsage} out of 80GB used</h6>
      ): (
      <h6>{this.state.dataUsage} out of 0.3GB used</h6>
      )}
      </div>
      <div className="upgrade" style={{marginLeft:"auto", marginRight:"auto", textAlign:"center"}}>
      {this.state.upgrade &&
        <Link to="/get-premium">
        <Button style={{marginTop:"10px"}}>Get Premium</Button>
        </Link>
      }
      </div>

      <CardDeck>
      <Container>
      <Row>
      <Col style={{marginLeft:"auto", marginRight:"auto", textAlign:"center", minWidth:"340px", maxWidth:"340px", marginTop:"20px", marginBottom: "20px"}}>
      <Card>
        <CardImg top style={{width:"100px",
          marginLeft: "auto",
          marginRight: "auto"}} width="100%" src={process.env.PUBLIC_URL + "/album.png"} alt="Card image cap" />
          <p style={{fontSize:"11px"}}><a target="_blank" href="https://icons8.com/icons/set/add-album">Add Album icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>
        <CardBody style={{color:"black"}}>
          <CardTitle><b>Upload Album</b></CardTitle>
          <CardSubtitle>Upload a Hip-Hop or R&B <b>album</b> to a live feed and your own profile</CardSubtitle>
          <Link to="/upload/album/">
          <Button disabled={this.state.disabled} style={{marginTop:"100px"}}>Start</Button>
          </Link>
        </CardBody>
      </Card>
      </Col>
      <Col style={{marginLeft:"auto", marginRight:"auto", textAlign:"center", minWidth:"340px", maxWidth:"340px", marginTop:"20px", marginBottom: "20px"}}>
     <Card>
        <CardImg top style={{width:"100px",
          marginLeft: "auto",
          marginRight: "auto"}} width="100%" src={process.env.PUBLIC_URL + "/track.png"} alt="Card image cap" />
          <p style={{fontSize:"11px"}}><a target="_blank" href="https://icons8.com/icons/set/add-song">Add Song icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>
        <CardBody style={{color:"black"}}>
          <CardTitle><b>Upload Track</b></CardTitle>
          <CardSubtitle>Upload a Hip-Hop or R&B <b>track</b> to a live feed and your own profile</CardSubtitle>
           <Link to="/upload/track">
          <Button disabled={this.state.disabled} style={{marginTop:"100px"}}>Start</Button>
          </Link>
        </CardBody>
      </Card>
      </Col>
      <Col style={{marginLeft:"auto", marginRight:"auto", textAlign:"center", minWidth:"340px", maxWidth:"340px", marginTop:"20px", marginBottom: "20px"}}>
      <Card>
        <CardImg top style={{width:"100px",
          marginLeft: "auto",
          marginRight: "auto"}} width="100%" src={process.env.PUBLIC_URL + "/video.png"} alt="Card image cap" />
          <p style={{fontSize:"11px"}}><a target="_blank" href="https://icons8.com/icons/set/video">Video icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a></p>
          <CardBody style={{color:"black"}}>
          <CardTitle><b>Upload Video</b></CardTitle>
          <CardSubtitle>Upload a Hip-Hop or R&B <b>video</b> to a live feed and your own profile</CardSubtitle>
          <Link to="/upload/video">
          <Button disabled={this.state.disabled} style={{marginTop:"100px"}}>Start</Button>
          </Link>
        </CardBody>
      </Card>
      </Col>
      </Row>
      </Container>
    </CardDeck>
                
 

    </div>

 
      
    );
    } 
   }
  }
}
UploadPage.contextType = Auth0Context;

export default UploadPage;