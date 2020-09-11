import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import { Container, Row, Col } from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody, CardDeck,
  CardTitle, CardSubtitle, CardLink, Button
} from 'reactstrap';
import {
 BrowserRouter as Router,
 Switch,
 Route
} from "react-router-dom";
import ProfileBar from '../profile-bar';


class ProfileTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {},
    };

  }


  componentDidMount() {
    let user_id = this.context.user.sub;
    console.log("user_id" + user_id)
    console.log('COMPONENT HAS MOUNTED');
    let album = this.state.album;
    fetch(`/artist/track/${user_id}`)
    .then((response) =>
      response.json())
    .then((data) => {
      console.log("data" + data)
      this.setState({ track : data });

    }).catch((error) => {
      console.log("Error " + error)
    })

  }




  render() {
    console.log(this.state.track)
    return (
 <div>
       <div>
        <ProfileBar />
        </div>

<div>
      <ul>
      <CardDeck>

      {this.state.track.length && this.state.track.map((track,index) => {
        return ( 

          <div key={index}> 
          <Link to={`/${track.id}/track/edit`}>
          <Card style={{width: "200px", height:"299px", marginBottom: "15px", marginTop: "15px", borderColor: "darkgrey"}}>
          <CardImg style={{width: "190px", height:"190px", display: "block",
          marginLeft: "auto",
          marginTop: "4px",
          marginRight: "auto",
          border:"1px solid lightgrey"}} src={"https://hiphopvolumebucket.s3.amazonaws.com/" + track.path} />
          <CardBody>
          <CardTitle style={{whiteSpace: "nowrap",
          color: "black",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "13px"}}>
          <b>
          {track.title}
          </b>
          </CardTitle>
          <CardText style={{whiteSpace: "nowrap",
          overflow: "hidden",
          color: "black",
          textOverflow: "ellipsis", 
          fontSize: "11px"}}>
          {track.description}
          </CardText>
          </CardBody>
          </Card>
          </Link>
          </div>

        )})}
        </CardDeck>

        </ul>
        </div>
        </div>


      
        )
      }
    };
ProfileTracks.contextType = Auth0Context;

export default ProfileTracks;