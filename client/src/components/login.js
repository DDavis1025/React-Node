// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import { Button } from 'reactstrap';

const Login = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div class="container">
    <div class="center">
      {!isAuthenticated && (
       <Button color="secondary" size="lg" onClick={() => loginWithRedirect({})}>Log in</Button>
      )}
    </div>
    </div>
  );
};

export default Login;