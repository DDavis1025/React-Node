import React, { Component } from "react";
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


class EmailNotVerified extends Component {
  constructor(props) {
    super(props);
    this.sendEmailValidation = this.sendEmailValidation.bind(this);
    const { pathname } = this.props.location;
    console.log(pathname)

 
    this.state = {
    };
 
  }


  componentDidMount() {
    let email_verified = this.context.user.email_verified;
  }

  sendEmailValidation = async () => {
    let user_id = this.context.user.sub;
    try {
    const emailValidation = await axios.post('http://localhost:8000/emailVerification', {'user_id': user_id});
    alert('Email Sent')
    console.log(emailValidation)
    } catch(err) {
      console.log(err.response)
      if (err.response.status == 429) {
        alert(err.response.data)
      }
    }
  }





  
  render() {
    const { pathname } = this.props.location;
    if(pathname === "/mobile-privacy-policy" || pathname === "/website-privacy-policy" || pathname === "/mobile-terms-of-service") {
        return null;
    }
    console.log(this.context)
    if (this.context) {
    if (!this.context.user.email_verified) {
      return(
       <div style={{marginTop:"20px", marginLeft:"auto", marginRight:"auto", textAlign:"center"}}>
       <h3>Please verify your email</h3><Button className="resendEmail" outline color="primary" onClick={this.sendEmailValidation}>Resend Email</Button>
       <p>or</p>
       <Button className="resendEmail" outline color="primary" onClick={() => window.location.reload(false)}>Done. Reload</Button>
       </div>
      )
    }
  }
}
}

EmailNotVerified.contextType = Auth0Context;

export default EmailNotVerified;