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
import { Media } from 'reactstrap';
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

function CopyrightInfringingTrack() {

  let [track, setTrack] = useState('');
  let [track_audio, setTrackAudio] = useState('');
  let [track_image, setTrackImage] = useState('');
  const { item_id, type } = useParams();

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
       const track = await axios.get(`http://localhost:8000/track/${item_id}`);
       console.log(track.data)
       setTrack(track.data[0])
       setTrackAudio(track.data[1].path)
       setTrackImage(track.data[2].path)

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);


if (track) {
if (track.copyright_infringing_music) {
if (auth0Context.user.sub === track.author) {
if (type == 'track_image' && track.copyright_infringing_image) {
return (
     <div>

       <Container style={{marginLeft: "20px"}}>
        <Row>
        <img style={{border: "2px solid black"}} width="320" height="320" src={process.env.PUBLIC_URL + "/music-placeholder.png"} />
      </Row>
        <Row>
            <div>
                <audio src={"https://hiphopvolumebucket.s3.amazonaws.com/" + track_audio} style={{width:"500px"}} controls></audio>
              </div>
        </Row>
       <Row>
        <b>Title:</b> {track.title}
        </Row>
        <Row>
        <p><b>Description:</b> {track.description}</p>
        </Row>
        <Row>
          <h4>This image was taken down for copyright infringement</h4>

        </Row>
      </Container>


      
        </div>
);
} else if (type == 'track' && track.copyright_infringing_music) {
  console.log(type + track)
  return (
     <div>

       <Container style={{marginLeft: "20px"}}>
        <Row>
        <img style={{border: "2px solid black"}} width="320" height="320" src={"https://hiphopvolumebucket.s3.amazonaws.com/" + track_image} />
      </Row>
       <Row>
        <b>Title:</b> {track.title}
        </Row>
        <Row>
        <p><b>Description:</b> {track.description}</p>
        </Row>
        <Row>
        <h4>This track was taken down for copyright infringement</h4>

        </Row>
      </Container>


      
        </div>
);
} else {
  console.log(type + track)
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
  return(
  <div></div>
  )
}
} else {
  return(
  <div></div>
  )
}

}

export default CopyrightInfringingTrack;
