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


class ProfileAlbums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: {},
    };

  }


  componentDidMount() {
    let user_id = this.context.user.sub;
    console.log('COMPONENT HAS MOUNTED');
    fetch(`/artist/${user_id}`)
    .then((response) =>
      response.json())
    .then((data) => {
      this.setState({ album : data });

    }).catch((error) => {
      console.log("Error " + error)
    })

  }

 


  render() {
    console.log("this.state.album" + JSON.stringify(this.state.album))
    return (
 <div>
       <div>
        <ProfileBar />
        </div>

<div>
      <ul>
      <CardDeck>

      {this.state.album.length && this.state.album.map((album,index) => {
        return ( 

          <div key={index}> 
          <Link to={`/${album.id}/album/edit`}>
          <Card style={{width: "200px", height:"299px", marginBottom: "15px", marginTop: "15px", borderColor: "darkgrey"}}>
          <CardImg style={{width: "190px", height:"190px", display: "block",
          marginLeft: "auto",
          marginTop: "4px",
          marginRight: "auto",
          border:"1px solid lightgrey"}} src={"https://hiphopvolumebucket.s3.amazonaws.com/" + album.path} />
          <CardBody>
          <CardTitle style={{whiteSpace: "nowrap",
          color: "black",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "13px"}}>
          <b>
          {album.title}
          </b>
          </CardTitle>
          <CardText style={{whiteSpace: "nowrap",
          overflow: "hidden",
          color: "black",
          textOverflow: "ellipsis", 
          fontSize: "11px"}}>
          {album.description}
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
ProfileAlbums.contextType = Auth0Context;

export default ProfileAlbums;