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

function CopyrightInfringingAlbum() {

  let [album, setAlbum] = useState('');
  let [songs, setSongs] = useState('');
  let [album_image, setAlbumImage] = useState('');
  const { album_id } = useParams();

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
      
       const album = await axios.get(`https://www.hiphopvolume.com/albums/${album_id}`);
       console.log(album.data[0])
       setAlbum(album.data[0])
       const songs = await axios.get(`https://www.hiphopvolume.com/songs/copyright_infringing/${album_id}`);
       console.log(songs.data)
       setSongs(songs.data)

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);


if (album) {
if (album.copyright_infringing_music) {
if (auth0Context.user.sub === album.author) {
return (
     <div>

       <Container style={{marginLeft: "20px"}}>
       {album.copyright_infringing_image ?
        <div>
        <Row>
        <img style={{border: "2px solid black"}} width="320" height="320" src={process.env.PUBLIC_URL + "/music-placeholder.png"} />
        </Row>
        <Row>
          <h4>This image was taken down for copyright infringement</h4>
        </Row>
        </div>
        :
        <Row>
        <img style={{border: "2px solid black"}} width="320" height="320" src={"https://hiphopvolumebucket.s3.amazonaws.com/" + album.path} />
      </Row>
        }
       <Row>
        <b>Title:</b> {album.title}
        </Row>
        <Row>
        <p><b>Description:</b> {album.description}</p>
        </Row>
        <Row>
        <h4>This album was taken down for copyright infringement</h4>
        </Row>
        {album.copyright_infringing_music &&
       <Row>
       <div>
       <h6>Song</h6>
        {songs.length > 0 &&
         <ul>
            {songs.map((song, index) => (
              <li key={index}>
                {song.name}
              </li>
              
            ))}
          </ul>
        }
        <h6>Was the subject of copyright infringement</h6>
        </div>
        </Row>
      }
      </Container>


      
        </div>
);
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
} else {
  console.log(auth0Context.user.sub + album.author)
  return(
  <div></div>
  )
}

}

export default CopyrightInfringingAlbum;
