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

function ReviewVideo() {

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
      const auth0User = await axios.get(`/getAuth0User/${auth0Context.user.sub}`);
      setUser(auth0User.data)
       const video = await axios.get(`/video/${item_id}`);
       console.log(video.data)
       setCopyrightInfringment(video.data[0].copyright_infringing_music)
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


async function acceptPost() {
  console.log("acceptPost")
    try {

      const acceptPost = await axios.put(`/acceptSubmission/video/${item_id}`);

      alert('This post was accepted');

      console.log(acceptPost)

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

async function declinePost() {
    try {

      const declinePost = await axios.put(`/declineSubmission/video/${item_id}`);

      alert('This post was declined');

      console.log(acceptPost)

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }


async function deleteProfile() {
    try {

      const deleteProfile = await axios.delete(`/removeProfile/${video_author}`);

      alert('Author account was deleted for too many copyright strikes');

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

  async function setCopyrightInfringementTrue() {
    try {

      const setCopyrightInfringementTrue = await axios.post(`/setCopyrightInfringementTrueVideo/${video_author}/${item_id}`);

      alert('Copyright Infringement set');

      console.log(setCopyrightInfringementTrue.data.copyright_strikes)

      if (setCopyrightInfringementTrue.data.copyright_strikes >= 5) {
        if (window.confirm(`copyright strikes = ${setCopyrightInfringementTrue.data.copyright_strikes}. Are you sure you want to remove this profile`)) {
          deleteProfile()
        }
      }

      // history.push('/');
    } catch(err) {
      if (err.response.status == 409) {
        alert(err.response.data.message)
      }
      console.log(err.response.data.mes)
    }
  }

  async function setCopyrightInfringementFalse() {
    try {

      const setCopyrightInfringementFalse = await axios.post(`/setCopyrightInfringementFalseVideo/${item_id}`);

      alert('Copyright Infringement removed');

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

 
if(user) {
if (user.app_metadata) {
if (user.app_metadata.roles === "Admin") {
  console.log(copyright_infringement)
return (
 
<div className="downloadMusic">

<div>
      <Container>
      <Row>
      <Col>
      <div>
      <video src={"https://hiphopvolumebucket.s3.amazonaws.com/" + user_video.path} width="640" height="360" crossOrigin="anonymous" controls></video>
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
                  
      <Container>
       <div className="reviewButtons" style={{marginLeft:"20px"}}>
       <Row>

           <ButtonToggle color="success" size="sm" onClick={acceptPost}>Accept
           </ButtonToggle> 
           </Row>
           <Row>
           <Button className="declinePost" color="danger" size="sm" onClick={declinePost}>Decline</Button>
           </Row>
           {!copyright_infringement ?
           <Row>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementTrue}>DMCA Strike</Button>
           </Row>
           : 
           <Row>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementFalse}>Remove Copyright Infringement</Button>
           </Row>
         }
       </div>
       </Container>




 

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
} else {
  return (
  <div></div>
  )
}



};


export default ReviewVideo;
