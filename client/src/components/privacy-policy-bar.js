import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class PrivacyPolicyBar extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return (
 
        <div className="privacy-policy-nav">
         <ul className="nav-menu">
         <li><a className="nav-menu" href="/mobile-privacy-policy">Mobile Privacy Policy</a></li>
         <li><a className="nav-menu" href="/website-privacy-policy">Website Privacy Policy</a></li>
         </ul>
        </div>

 
      
    );
  }
}

export default PrivacyPolicyBar;