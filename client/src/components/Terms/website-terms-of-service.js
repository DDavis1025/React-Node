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
import TermsOfServiceBar from './terms-of-service-bar';
import sanitizeHtml from 'sanitize-html';



function WebsiteTermsOfService() {
  // State
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState('');

  useEffect( () => {
    async function getPrivacyPolicy() {
    let response = await axios.get(`https://app.termageddon.com/api/policy/VjFwSVFscHlUa2RCVUdJeFdWRTlQUT09`);
    setResponse(response)
    console.log(response)
    }
    getPrivacyPolicy()
  	async function fetchData() {

  	try {
    } catch(err) {
    }
   }
    fetchData()
  }, []);

  return (
    <div className="privacyPolicy">
    <TermsOfServiceBar/>
     <Row>
      <Col style={{marginRight: "20px", marginLeft: "20px", width: "70%"}}>
       <div dangerouslySetInnerHTML={{__html: sanitizeHtml(response.data, {
       allowedTags: false,
       allowedAttributes: false
       })}} /> 


      </Col>
      </Row> 

      <style dangerouslySetInnerHTML={{__html: sanitizeHtml( `
      .loginLogout { display: none; }
    `)}} />    
    </div>

  	

  );
 };

export default WebsiteTermsOfService;