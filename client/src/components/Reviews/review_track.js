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
import EditTrackFields from "../Edit/editTrackFields";


function ReviewTrack() {

  const [user, setUser] = useState('');
  const [loading, setLoading] = useState('');
  let [user_fields, setUserFields] = useState('');
  let [user_track, setUserTrack] = useState('');
  let [track_image, setTrackImage] = useState('');
  let [track_author, setTrackAuthor] = useState('');
  let [copyright_infringement, setCopyrightInfringment] = useState(false);
  let [copyright_infringement_image, setCopyrightInfringmentImage] = useState(false);
  const { item_id } = useParams();

  const auth0Context = useContext(Auth0Context);



useEffect( () => {
  async function fetchData() {
    try {
      const auth0User = await axios.get(`http://localhost:8000/getAuth0User/${auth0Context.user.sub}`);
      setUser(auth0User.data)
       const track = await axios.get(`http://localhost:8000/track/${item_id}`);
       console.log(track.data)
       setCopyrightInfringment(track.data[1].copyright_infringing_content)
       setTrackAuthor(track.data[0].author)
       setUserFields(track.data[0]) 
       setUserTrack(track.data[1])
       setTrackImage(track.data[2])
       setCopyrightInfringmentImage(track.data[2].copyright_infringing_content)
       console.log(track.data[2].copyright_infringing_content + "track_image")

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);


async function acceptPost() {
  console.log("acceptPost")
    try {

      const acceptPost = await axios.put(`http://localhost:8000/acceptSubmission/track/${item_id}`);

      alert('This post was accepted');

      console.log(acceptPost)

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

async function declinePost() {
    try {

      const declinePost = await axios.put(`http://localhost:8000/declineSubmission/track/${item_id}`);

      alert('This post was declined');

      console.log(acceptPost)

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }


async function deleteProfile() {
    try {

      const deleteProfile = await axios.delete(`http://localhost:8000/removeProfile/${track_author}`);

      alert('Author account was deleted for too many copyright strikes');

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

  async function setCopyrightInfringementTrue() {
    try {

      const setCopyrightInfringementTrue = await axios.post(`http://localhost:8000/setCopyrightInfringementTrueTrack/${track_author}/${item_id}`);

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

  async function setCopyrightInfringementTrueImage() {
    try {

      const setCopyrightInfringementTrue = await axios.post(`http://localhost:8000/setCopyrightInfringementTrueTrackImage/${track_author}/${item_id}/${track_image.image_id}`);

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

      const setCopyrightInfringementFalse = await axios.post(`http://localhost:8000/setCopyrightInfringementFalseTrack/${item_id}`);

      alert('Copyright Infringement removed');

      // history.push('/');
    } catch(err) {
      console.log(err)
    }
  }

  async function setCopyrightInfringementFalseImage() {
    try {

      const setCopyrightInfringementFalse = await axios.post(`http://localhost:8000/setCopyrightInfringementFalseTrackImage/${item_id}/${track_image.image_id}`);

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
      {!copyright_infringement_image ?
           <Row style={{marginLeft:"20px"}}>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementTrueImage}>DMCA Strike (Image)</Button>
           </Row>
           : 
           <Row style={{marginLeft:"20px"}}>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementFalseImage}>Remove Copyright Infringement (Image)</Button>
           </Row>
         }
       <Row>
       <Col>
         <img style={{ width: "300px", height: "300px", border: "2px solid black"}} src={"https://hiphopvolumebucket.s3.amazonaws.com/" + track_image.path} />
         </Col>
         </Row>
          <Row>
          <Col>
                   <div>
                   <audio src={"https://hiphopvolumebucket.s3.amazonaws.com/" + user_track.path} style={{width:"500px"}} controls></audio>
                   </div>
      

          </Col>
          </Row>
          {!copyright_infringement ?
           <Row style={{marginLeft:"20px"}}>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementTrue}>DMCA Strike (Song)</Button>
           </Row>
           : 
           <Row style={{marginLeft:"20px"}}>
           <Button className="setCopyrightInfringment" size="sm" onClick={setCopyrightInfringementFalse}>Remove Copyright Infringement (Song)</Button>
           </Row>
         }
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


export default ReviewTrack;
