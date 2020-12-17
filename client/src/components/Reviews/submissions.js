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
import sanitizeHtml from 'sanitize-html';

function Submissions() {

  const [user, setUser] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState('');

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
      const auth0User = await axios.get(`http://localhost:8000/getAuth0User/${auth0Context.user.sub}`);
      setUser(auth0User.data)
      console.log(auth0User.data.app_metadata.roles)
      const response = await axios.get(`http://localhost:8000/getSubmissions/`);
      setData(response.data)

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);

if(user) {
if (user.app_metadata.roles === "Admin") {
  console.log(data)
return (

<div style={{float:"left"}}>
<ul>
 
          {data.length && data.map((data, index) => {
            return(
            <div style={{float:"left", margin:"10px 30px 10px 30px"}} key={index}>
             <Row>
              
              <Card style={{width: "200px", height:"320px", marginBottom: "15px", marginTop: "15px", borderColor: "darkgrey"}}>
              <CardLink href={`/${data.type}/${data.id}/review`}>
               <CardBody>
               <CardTitle style={{whiteSpace: "nowrap",
               color: "black",
               overflow: "hidden",
               textOverflow: "ellipsis",
               fontSize: "13px"}}>
               <b>Title: </b>
               {data.title}
               </CardTitle>
               </CardBody>
               <CardBody>
            <CardImg style={{ width: "100px", height: "100px", display: "block",
          marginLeft: "auto",
          marginTop: "4px",
          marginRight: "auto",}} src={"https://hiphopvolumebucket.s3.amazonaws.com/" + data.path}>
            </CardImg>
            </CardBody>
            <CardBody>
              <CardText style={{whiteSpace: "nowrap",
               color: "black",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "13px"}}><b>Type: </b>{data.type}</CardText>
              <CardText style={{
               color: "black",
              fontSize: "10px"}}><b>Time Added: </b>{data.time_added.substring(0, 10)}</CardText>
            </CardBody>
            </CardLink>
            </Card>
            
            </Row>
            </div>
            )
          })}

</ul>

</div>
);
} else {
  return(
  <div></div>
  )
}
} else {
  return (
  <div></div>
  )
}



};


export default Submissions;
