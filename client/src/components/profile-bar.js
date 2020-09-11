import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class ProfileBar extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return (
 
        <div className="library-nav">
         <ul className="nav-menu">
         <li><Link className="nav-menu" to="/albums">Albums</Link></li>
         <li><Link className="nav-menu" to="/tracks">Tracks</Link></li>
         <li><Link className="nav-menu" to="/videos">Videos</Link></li>
         </ul>
        </div>

 
      
    );
  }
}

export default ProfileBar;