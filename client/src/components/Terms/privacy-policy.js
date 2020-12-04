import ReactDOM from "react-dom";
import styled from 'styled-components';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import { Progress } from 'reactstrap';
import axios from 'axios';
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
import sanitizeHtml from 'sanitize-html';


function PrivacyPolicy() {
  // State
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState('');

  
  useEffect( () => {

    async function getPrivacyPolicy() {
    let response = await axios.get(`https://app.termageddon.com/api/policy/VDFkWlREZHpUVEZUWkdOeVRHYzlQUT09`);
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



if (response) {
  return (
    <div className="privacyPolicy">
    <PrivacyPolicyBar/>
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
  } else {
    return(<div></div>)
  }
 };


export default PrivacyPolicy;