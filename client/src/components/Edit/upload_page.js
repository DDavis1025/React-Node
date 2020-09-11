import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
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


 
    this.state = {

    };
 
  }


  componentDidMount() {
    
  }


  
  render() {
    return (
 
      <div className="upload_page">
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
          <Link to="/album/upload">
          <Button style={{marginTop:"100px"}}>Start</Button>
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
           <Link to="/track/upload">
          <Button style={{marginTop:"100px"}}>Start</Button>
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
          <Link to="/video/upload">
          <Button style={{marginTop:"100px"}}>Start</Button>
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


export default UploadPage;