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


class Premium extends Component {
  constructor(props) {
  super(props);

 
    this.state = {
    };
 
  }


  componentDidMount() {
    let user_id = this.context.user.sub;
  }

  render() {
    return (

 
      <div className="premium">
      <CardDeck>
      <Container>
      <Row>
      <Col style={{marginLeft:"auto", textAlign:"center", marginRight:"auto", minWidth:"340px", maxWidth:"340px", marginTop:"20px", marginBottom: "20px"}}>
      <Card>
        <CardImg top style={{width:"140px",
          height:"140px",
          marginLeft: "auto",
          marginRight: "auto", marginTop:"5px", borderRadius: "10px"}} width="100%" src={process.env.PUBLIC_URL + "/HipHopVolumeLogo(Edited)(2).jpg"} alt="Card image cap" />
        <CardBody style={{color:"black"}}>
          <CardTitle style={{fontSize:"30px", textAlign:"center"}} className="premiumCardTitle"><b>Premium</b></CardTitle>
          <CardSubtitle style={{fontSize:"15px", textAlign:"center"}} className="premiumCardSubtitle">USD $5.00/Month(recurring payment)</CardSubtitle>
          <br></br>
          <ul style={{textAlign: "left"}}className="premiumUL">
          <li>80GB of media data. A regular 1 hour video is about 0.25GB</li>
          <li>No Ads</li>
          </ul>
         
          <Link to="/get-premium">
          <Button className="premiumButton" style={{marginTop:"100px"}}>Get Premium</Button>
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
Premium.contextType = Auth0Context;

export default Premium;