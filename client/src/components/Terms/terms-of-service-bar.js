import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class TermsOfServiceBar extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return (
 
        <div className="privacy-policy-nav">
         <ul className="nav-menu">
         <li><Link className="nav-menu" to="/mobile-terms-of-service">Terms Of Service (Mobile App)</Link></li>
         <li><Link className="nav-menu" to="/website-terms-of-service">Terms Of Service (Website)</Link></li>
         </ul>
        </div>

 
      
    );
  }
}

export default TermsOfServiceBar;