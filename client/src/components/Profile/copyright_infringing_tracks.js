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
import CopyrightBar from './copyright_bar';

class CopyrightInfringingTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: {},
      copyright_infringing_image: false,
    };

  }


  componentDidMount() {
    let user_id = this.context.user.sub;
    console.log('COMPONENT HAS MOUNTED');
    fetch(`/tracks/copyright_infringing/${user_id}`)
    .then((response) =>
      response.json())
    .then((data) => {
      this.setState({ tracks : data });
      if (data[0].copyright_infringing_image) {
      this.setState({copyright_infringing_image: true}) 
    }

    }).catch((error) => {
      console.log("Error " + error)
    })

  }

 


  render() {
    return (
 <div>
<CopyrightBar />
<div>
      <ul>
      <CardDeck>

      {this.state.tracks.length && this.state.tracks.map((track,index) => {
        return ( 

          <div key={index}> 
          <Link to={`/${track.id}/copyright_infringing/track`}>
          <Card style={{width: "200px", height:"320px", marginBottom: "15px", marginTop: "15px", borderColor: "darkgrey"}}>
          {this.state.copyright_infringing_image ?
          <CardImg style={{width: "190px", height:"190px", display: "block",
          marginLeft: "auto",
          marginTop: "4px",
          marginRight: "auto",
          border:"1px solid lightgrey"}} src={process.env.PUBLIC_URL + "/music-placeholder.png"} />
          :
          <CardImg style={{width: "190px", height:"190px", display: "block",
          marginLeft: "auto",
          marginTop: "4px",
          marginRight: "auto",
          border:"1px solid lightgrey"}} src={"https://hiphopvolumebucket.s3.amazonaws.com/" + track.path} />
          }
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
          <CardText style={{whiteSpace: "nowrap",
          overflow: "hidden",
          color: "red",
          textOverflow: "ellipsis", 
          fontSize: "11px"}}>
          Copyright Infringement
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
CopyrightInfringingTracks.contextType = Auth0Context;

export default CopyrightInfringingTracks;