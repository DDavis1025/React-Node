// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import LoginButton from "./login"
import { Button } from 'reactstrap';

const NavBar2 = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
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