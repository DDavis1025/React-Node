import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class CopyrightBar extends Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return (
 
        <div className="library-nav">
         <ul className="nav-menu">
         <li><Link className="nav-menu" to="/albums/copyright_infringing">Albums</Link></li>
         <li><Link className="nav-menu" to="/tracks/copyright_infringing">Tracks</Link></li>
         <li><Link className="nav-menu" to="/videos/copyright_infringing">Videos</Link></li>
         </ul>
        </div>

 
      
    );
  }
}

export default CopyrightBar;