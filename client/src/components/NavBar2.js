// src/components/NavBar.js
import {Auth0Context} from "../react-auth0-spa"
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import LoginButton from "./login"
import { Button } from 'reactstrap';
import React, {useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NavBar2 = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const auth0Context = useContext(Auth0Context);

  const [user, setUser] = useState('');
  const [isAdmin, setIsAdmin] = useState('');

  useEffect( () => {
  async function fetchData() {
    try {
      if (auth0Context.user.sub != undefined) {
      const auth0User = await axios.get(`http://localhost:8000/getAuth0User/${auth0Context.user.sub}`);
      setUser(auth0User.data)
      if (auth0User.data.app_metadata) {
      if (auth0User.data.app_metadata.roles) {
      if (auth0User.data.app_metadata.roles === 'Admin') {
        console.log(auth0User.data)
        setIsAdmin(true)
      }
     }
    }
  }

    } catch(err) {
        console.log(err)
    }
   }
    fetchData()
  }, []);

  return (
    <div className="loginLogout">
      {!isAuthenticated && (
        <LoginButton/>
        // <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}
      {isAuthenticated && <Button style={{display: "inlineBlock"}} color="secondary" onClick={() => logout()}>Log out</Button>}

      {isAdmin &&
      <div className="adminNavbar">
      <ul style={{
      margin: 0,
      padding: 0,
      overflow: "hidden",
      listStyleType: "none",
      }}>
      <li> <Link to="/submissions"><h7>Submissions</h7></Link></li>
      <li> <Link to="/accepted_submissions"><h7>Accepted Submissions</h7></Link></li>
      <li> <Link to="/declined_submissions"><h7>Declined Submissions</h7></Link></li>
      </ul>
      </div>
      }
    </div>
  );
};

export default NavBar2;