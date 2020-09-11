import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import auth0Client from "../Auth";
import { useAuth0 } from "../react-auth0-spa";
import {Auth0Context} from "../react-auth0-spa"
import { Auth0Provider } from "../react-auth0-spa";
import Profile from './Profile';
import ProfileBar from './profile-bar';
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class ProfilePage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {

    };
 
  }
   
    componentDidMount() {
   
    }

  
  render() {
    return (
 
      
      <div className="profile-page">
        <ProfileBar />
      
      </div>

 
      
    );
  }
}

export default ProfilePage;