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


function MobileTermsOfService() {
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
     <Row>
      <Col style={{marginRight: "20px", marginLeft: "20px", width: "70%"}}>
      
      <h1>Not Yet Available</h1>

      </Col>
      </Row> 

      <style dangerouslySetInnerHTML={{__html: `
      .loginLogout { display: none; }
    `}} />    
    </div>

  	

  );
 };

export default MobileTermsOfService;