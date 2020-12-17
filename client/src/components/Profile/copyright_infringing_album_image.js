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

function CopyrightInfringingAlbumImage() {

  const [user, setUser] = useState('');
  const [loading, setLoading] = useState('');
  let [user_fields, setUserFields] = useState('');
  let [album, setAlbum] = useState('');
  let [songs, setSongs] = useState('');
  let [audio, setAudio] = useState('');
  let [album_image, setAlbumImage] = useState('');
  let [album_author, setAlbumAuthor] = useState('');
  let [copyright_infringement, setCopyrightInfringment] = useState(false);
  let [copyright_infringement_image, setCopyrightInfringmentImage] = useState(false);
  const { album_id } = useParams();

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
      // const auth0User = await axios.get(`http://localhost:8000/getAuth0User/${auth0Context.user.sub}`);
      //  setUser(auth0User.data)
       const album = await axios.get(`http://localhost:8000/albums/${album_id}`);
       console.log(album.data[0])
       setAlbum(album.data[0])
       // setCopyrightInfringment(album.data[0].copyright_infringing_music)
       // setCopyrightInfringmentImage(album.data[0].copyright_infringing_image)
       // setAlbumImage(album.data[0].image_id)
       // setAlbumAuthor(album.data[0].user_id)
       // setUserVideo(video.data[1])
       // setVideoImage(video.data[2])

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);


if (album) {
if (album.copyright_infringing_image) {
  console.log("album")
if (auth0Context.user.sub === album.author) {
return (
     <div>

       <Container style={{marginLeft: "20px"}}>
        <Row>
        <img style={{border: "2px solid black"}} width="320" height="320" src={process.env.PUBLIC_URL + "/music-placeholder.png"}/>
      </Row>
       <Row>
        <b>Title:</b> {album.title}
        </Row>
        <Row>
        <p><b>Description:</b> {album.description}</p>
        </Row>
        <Row>
        <h4>This image and album was taken down for copyright infringement</h4>
        </Row>
      </Container>


      
        </div>
);
} else {
  return(
  <div></div>
  )
} 
} else {
  console.log(auth0Context.user.sub + album.author)
  return(
  <div></div>
  )
} 
} else {
  console.log(auth0Context.user.sub + album.author)
  return(
  <div></div>
  )
}

}

export default CopyrightInfringingAlbumImage;