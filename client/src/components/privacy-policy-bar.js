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
         <li><Link className="nav-menu" to="/mobile-privacy-policy">Privacy Policy (Mobile App)</Link></li>
         <li><Link className="nav-menu" to="/website-privacy-policy">Privacy Policy (Website)</Link></li>
         </ul>
        </div>

 
      
    );
  }
}

export default PrivacyPolicyBar;