import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import { Button } from "reactstrap";
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import Profile from '../Profile';
import { withRouter } from "react-router";
import EditTrackFields from "./editTrackFields"
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class EditTrack extends Component {
  constructor(props) {
    super(props);
 
    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.save = this.save.bind(this);
    this.audioRef = React.createRef();
    this.deleteClick = this.deleteClick.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();
    this.resetFile = this.resetFile.bind(this);


 
    this.state = {
      file: null,
      beforeImageSave: null,
      isLoading: false,
      userHasAccess: null,
      user_track: {},
      user_fields: {title:"", date:"", description:""},
      user_image: {},

    };
 
  }


  resetFile(event) {
    event.preventDefault();
    this.setState({ user_image: null });
  }

  onChange(event) {
    console.log(event.target.files[0])
    this.setState({
      file: event.target.files[0], 
      beforeImageSave: URL.createObjectURL(event.target.files[0]),
      loaded: 0,
    });
  }



  componentDidMount() {
    let value = this.context;
  // auth0Client.handleAuthentication();
  const { match: { params} } = this.props;
  let user_fields = this.state.user_fields;
  let user_track = this.state.user_track;
  let user_image = this.state.user_image;
  fetch(`/track/${params.trackId}`)
  .then((response) =>
    response.json())
  .then((data) => {
    console.log("data" + JSON.stringify(data[0]))
    this.setState({ user_fields : data[0], user_track: data[1], user_image: data[2] });
    console.log("user_fields" + JSON.stringify(this.state.user_fields))
    if (this.context.user.sub === this.state.user_fields.author) {
     this.setState({userHasAccess: true})
   }
 }).catch((error) => {
    console.log(`Error: ${error}`)
  })

      }

fieldChange (event) {
   const { name, value } = event.target;
   this.setState(prevState => ({
   user_fields: {...prevState.user_fields, [name]: value}
   }));

  }




save(event) {
  event.preventDefault();

  let user_id;
  
  let data;

  const { match: { params} } = this.props;

  Promise.resolve().then(() => {

  user_id = this.context.user.sub;
  
  data = new FormData()

  console.log("this.state.file" + this.state.file)

  data.append('file', this.state.file)

  data.append('fields', JSON.stringify(this.state.user_fields))
}).then(()=> {
  axios.put(`/track/${params.trackId}`, data, { 
  }).then(res => { // then print response status
    const { match, location, history } = this.props;
    history.push("/");
 })
}).catch((err)=> {console.log(err)});

}




 

  clickFileInput() {
    this.inputRef.current.click();
  }

  replaceInput() {
    this.replaceInputRef.current.click();
  }

  clickAddFiles () {
    this.addFiles.current.click();
  }


onClick(event) {
  let trackFields = this.state.user_fields;
  if(trackFields.date  === "" || trackFields.title  === "" || trackFields.description === "") {
    alert("ERROR: You have data or information that you haven't added");
    } else {
  this.save(event);

}
}


  deleteClick() {
  const { match, location, history } = this.props;
  const { match: { params} } = this.props;
  var c = window.confirm("Are You Sure You Want To Delete This Post?");
  if (c === true) {
  axios.delete(`/track/${params.trackId}`)
      .then(res => {
        console.log(res)
        history.push("/tracks");
      })
    }
  }

  
  render() {
    console.log(this.state.user_fields + "this.state.user_fields" + this.state.file)
    let image = "https://hiphopvolumebucket.s3.amazonaws.com/" + this.state.user_image.path;
    if (!this.state.userHasAccess) {
    return (
    <div>
    <h1 style={{marginLeft: "20px", marginTop: "20px"}}>403 Forbidden</h1>
    <p style={{marginLeft: "20px"}}>You don't have permisson to access this page</p>
    </div>

    )
  } else {
    return (
 
      
      <div className="downloadMusic">



<div>
      <Container>
          <Row>
          <Col>
                   <div>
                   <audio src={"https://hiphopvolumebucket.s3.amazonaws.com/" + this.state.user_track.path} style={{width:"500px"}} ref={this.audioRef} controls></audio>
                   </div>
      

          </Col>
          </Row>
          </Container>
              
          <Container>                 
           <Row>
           <Col>
          <EditTrackFields
            beforeImageSave={this.state.beforeImageSave}
            file={image}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onClick={this.resetFile}
            field={this.state.user_fields}
            fieldChange={this.fieldChange}
          />
        </Col>
        </Row>
        </Container>

                  
                  

      </div>   
                  


      <Container>
       <div>
       <Row>

           <ButtonToggle onClick={this.onClick} color="success">Save
           </ButtonToggle> 
           </Row>
           <Row>
           <Button color="danger" size="sm" onClick={this.deleteClick}>Delete</Button>

         </Row>
       </div>
       </Container>




 

</div>

 
      
    );
   }
  }
}

EditTrack.contextType = Auth0Context;

export default EditTrack;