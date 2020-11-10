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
import { useHistory } from 'react-router-dom';
import React, {useState, useContext, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import PrivacyPolicyBar from '../privacy-policy-bar';


function WebsitePrivacyPolicy() {
  // State
  const [email, setEmail] = useState('');

  useEffect( () => {
  	async function fetchData() {

  	try {
    } catch(err) {
    }
   }
    fetchData()
  }, []);

  return (
    <div className="privacyPolicy">
    <PrivacyPolicyBar/>
     <Row>
      <Col style={{marginRight: "20px", marginLeft: "20px", width: "70%"}}>
      <h3>Website</h3>
      <div id="policy" width="640" height="480"
data-policy-key="SzFOYWVsRjNOMlZPWkRkRk4wRTlQUT09"> </div>

      </Col>
      </Row> 

      <style dangerouslySetInnerHTML={{__html: `
      .loginLogout { display: none; }
    `}} />    
    </div>

  	

  );
 };

export default WebsitePrivacyPolicy;