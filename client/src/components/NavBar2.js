// src/components/NavBar.js
import {Auth0Context} from "../react-auth0-spa"
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import LoginButton from "./login"
import { Button } from 'reactstrap';
import React, {useContext} from 'react';

const NavBar2 = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const auth0Context = useContext(Auth0Context);

  return (
    <div className="loginLogout">
      {!isAuthenticated && (
        <LoginButton/>
        // <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}
      {isAuthenticated && <Button color="secondary" onClick={() => logout()}>Log out</Button>}

      {isAuthenticated && (
      <span>
      </span>
    )}
    </div>
  );
};

export default NavBar2;