import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import uuid from 'uuid/v4';

class Upload extends React.Component {
  constructor(props) {
    super(props);

  }



  render() {

    return (

      <div className="container">
       <div className="row">
        <div className="col text-center">
        <Link to='/album/create'>
        <Button color="primary">Upload</Button>
        </Link>
    </div>
  </div>
</div>

    );

  }
}



export default Upload;