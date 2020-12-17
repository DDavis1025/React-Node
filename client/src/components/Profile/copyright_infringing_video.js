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
import { useHistory , useParams} from 'react-router-dom';
import React, {useState, useContext, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import sanitizeHtml from 'sanitize-html';
import EditTrackFields from "../Edit/editTrackFields"

function CopyrightInfringingVideo() {

  const [user, setUser] = useState('');
  const [loading, setLoading] = useState('');
  let [user_fields, setUserFields] = useState('');
  let [user_video, setUserVideo] = useState('');
  let [video_image, setVideoImage] = useState('');
  let [video_author, setVideoAuthor] = useState('');
  let [copyright_infringement, setCopyrightInfringment] = useState(false);
  let [copyright_infringement_image, setCopyrightInfringmentImage] = useState(false);
  const { item_id } = useParams();

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
      const auth0User = await axios.get(`http://localhost:8000/getAuth0User/${auth0Context.user.sub}`);
      setUser(auth0User.data)
       const video = await axios.get(`http://localhost:8000/video/${item_id}`);
       console.log(video.data)
       setVideoAuthor(video.data[0].author)
       setUserFields(video.data[0]) 
       setUserVideo(video.data[1])
       setVideoImage(video.data[2])

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);



 
if (user_video) {
if(user_fields.copyright_infringing_music) {
if (auth0Context.user.sub === video_author) {
  console.log(copyright_infringement)
return (
 
<div className="downloadMusic">

<div>
      <Container>
      <Row>
        <Col>
        <h4>This video was taken down for copyright_infringement</h4>
        </Col> 
      </Row>
      <Row>
      <Col>
      <div>
      <video src={""} width="640" height="360" crossOrigin="anonymous" controls></video>
      </div>
      <img style={{border: "2px solid black"}} width="320" height="180" src={"https://hiphopvolumebucket.s3.amazonaws.com/" + video_image.path} />

      </Col>
      </Row>
      </Container>
              
          <Container>                 
           <Row>
           <Col>
           <ul>
           <li>Title: {user_fields.title}</li>
           <li>Description: {user_fields.description}</li>
           </ul>
          
        </Col>
        </Row>
        </Container>
        
                  
                  

      </div>   
                




 

</div>
);
} else {
  return(
  <div></div>
  )
}
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


export default CopyrightInfringingVideo;
