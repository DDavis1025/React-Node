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

function ReviewAlbum() {

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
  const { item_id } = useParams();

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
      const auth0User = await axios.get(`http://localhost:8000/getAuth0User/${auth0Context.user.sub}`);
      setUser(auth0User.data)
       const album = await axios.get(`http://localhost:8000/albums/${item_id}`);
       console.log(album.data)
       setCopyrightInfringment(album.data[0].copyright_infringing_music)
       setCopyrightInfringmentImage(album.data[0].copyright_infringing_image)
       setAlbumImage(album.data[0].image_id)
       setAlbum(album.data[0])
       setAlbumAuthor(album.data[0].user_id)
       setSongs(album.data.slice(1)) 
       // setUserVideo(video.data[1])
       // setVideoImage(video.data[2])

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);

async function acceptPost() {
  console.log("acceptPost")
    try {

      const acceptPost = await axios.put(`http://localhost:8000/acceptSubmission/album/${item_id}`);

      alert('This post was accepted');

      window.location.reload(false);

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

async function declinePost() {
    try {

      const declinePost = await axios.put(`http://localhost:8000/declineSubmission/album/${item_id}`);

      alert('This post was declined');

      window.location.reload(false);


      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

  async function deleteProfile() {
    try {

      const deleteProfile = await axios.delete(`http://localhost:8000/removeProfile/${album_author}`);

      alert('Author account was deleted for too many copyright strikes');

      window.location.reload(false);

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }


async function setCopyrightInfringementTrue(song_id) {
    try {

      const setCopyrightInfringementTrue = await axios.post(`http://localhost:8000/setCopyrightInfringementTrueAlbum/${album_author}/${item_id}/${song_id}`);

      alert('Copyright Infringement set');

      console.log(setCopyrightInfringementTrue.data.copyright_strikes)

      if (setCopyrightInfringementTrue.data.copyright_strikes >= 5) {
        if (window.confirm(`copyright strikes = ${setCopyrightInfringementTrue.data.copyright_strikes}. Are you sure you want to remove this profile`)) {
          deleteProfile()
        }
      } else {
        window.location.reload(false);
      }


      // history.push('/');
    } catch(err) {
      if (err.response.status == 409) {
        alert(err.response.data.message)
      }
      console.log(err.response.data.mes)
    }
  }

  async function setCopyrightInfringementFalse(song_id) {
    try {

      const setCopyrightInfringementFalse = await axios.post(`http://localhost:8000/setCopyrightInfringementFalseAlbum/${item_id}/${song_id}`);

      alert('Copyright Infringement removed');

      window.location.reload(false);

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

  async function setCopyrightInfringementTrueImage() {
    try {

      const setCopyrightInfringementTrue = await axios.post(`http://localhost:8000/setCopyrightInfringementTrueAlbumImage/${album_author}/${item_id}/${album_image}`);

      alert('Copyright Infringement set');

      console.log(setCopyrightInfringementTrue.data)

      if (setCopyrightInfringementTrue.data.copyright_strikes >= 5) {
        if (window.confirm(`copyright strikes = ${setCopyrightInfringementTrue.data.copyright_strikes}. Are you sure you want to remove this profile`)) {
          deleteProfile()
        }
      } else {
        window.location.reload(false);
      }

      // history.push('/');
    } catch(err) {
      if (err.response.status == 409) {
        alert(err.response.data.message)
      }
      console.log(err.response.data.mes)
    }
  }

  async function setCopyrightInfringementFalseImage() {
    try {

      const setCopyrightInfringementFalse = await axios.post(`http://localhost:8000/setCopyrightInfringementFalseAlbumImage/${item_id}/${album_image}`);

      alert('Copyright Infringement removed');

      window.location.reload(false);

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }





 
if(user) {
if (user.app_metadata) {
if (user.app_metadata.roles === "Admin") {
console.log(songs)
return (
     <div style={{marginLeft: "20px"}}>
       <Container>
      {!copyright_infringement_image ?
           <Row style={{marginLeft:"20px"}}>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementTrueImage}>DMCA Strike (Image)</Button>
           </Row>
           : 
           <Row style={{marginLeft:"20px"}}>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementFalseImage}>Remove DMCA (Image)</Button>
           </Row>
         }
      <Row>
      <Col>
        <img style={{border: "2px solid black"}} width="320" height="320" src={"https://hiphopvolumebucket.s3.amazonaws.com/" + album.path} />
      </Col>
      </Row>
      <div style={{marginLeft: "20px"}}>
     <Row>
        <b>Title:</b> {album.title}
        </Row>
        <Row>
        <p><b>Description:</b> {album.description}</p>
        </Row>
        </div>
      </Container>


 <div className="audio-player">
       <audio
       controls
       autoPlay
       style={{width: "500px"}}
       type="audio/mpeg"
       src={"https://hiphopvolumebucket.s3.amazonaws.com/" + audio}
        />
         </div>

        <div>
        {songs.length > 0 &&
         <ul>
            {songs.map((album, index) => (
              <li key={index} onClick={(e) => {
                  e.preventDefault();
                  setAudio(album.path)
                  }}>
                  <a href={album.path}>{album.name}</a>
              </li>
              
            ))}
          </ul>
        }
        </div>

        <div>
        {songs.length > 0 &&
         <ul>
            {songs.map((album, index) => (
              <Row>
              <Col>
              <li key={index}>
              <p>{album.name}</p>
                  {!album.copyright_infringing_content ?
                  <ButtonToggle size="sm" onClick={() => {setCopyrightInfringementTrue(album.id)}} style={{marginLeft:"10px"}}>DMCA Strike
                  </ButtonToggle> 
                  :
                  <ButtonToggle size="sm" onClick={() => {setCopyrightInfringementFalse(album.id)}} style={{marginLeft:"10px"}}>Remove DMCA
                  </ButtonToggle> 
                }
              
              </li>
              </Col>
              </Row>

                
            ))}
          </ul>
        }

       

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


export default ReviewAlbum;
