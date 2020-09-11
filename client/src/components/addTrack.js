import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import auth0Client from "../Auth";
import { useAuth0 } from "../react-auth0-spa";
import {Auth0Context} from "../react-auth0-spa"
import { Auth0Provider } from "../react-auth0-spa";
import Profile from './Profile';
import { withRouter } from "react-router";
import TrackFields from "./trackFields"
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class AddTrack extends Component {
  constructor(props) {
    super(props);
 
    this.handleClick = this.handleClick.bind(this);
    this.replaceClick = this.replaceClick.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.save = this.save.bind(this);
    this.audioRef = React.createRef();
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();
    this.resetFile = this.resetFile.bind(this);


 
    this.state = {
      file: null,
      beforeImageSave: null,
      selectedTrack: null,
      isLoading: false,
      fileContent: null,
      trackSelected: false,
      trackFields: {title:"", date:"", description:""},
      uploading: false
    };
 
  }


  resetFile(event) {
    event.preventDefault();
    this.setState({ file: null });
  }

  onChange(event) {
    console.log(event.target.files[0])
    this.setState({
      beforeImageSave: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0],
      loaded: 0,
    })
  }


  componentDidMount() {
    let value = this.context;
  // auth0Client.handleAuthentication();
    console.log(value);
    console.log(this.props.myHookValue);
   
  }

fieldChange (event) {
   const { name, value } = event.target;
   this.setState(prevState => ({
   trackFields: {...prevState.trackFields, [name]: value}
   }));

  }
 

handleClick = event => {
  if (event.target.value.length != 0) {
  this.setState({ trackSelected: true });
  this.setState({ isLoading: true });
  }
 
 var file = event.target.files[0];

 
    const fileReader = new FileReader();

      fileReader.onerror = (error) => {
        console.log(error);
      }

      fileReader.onload = (e) => {
        this.setState({selectedTrack: file})
        this.setState({ fileContent: e.target.result})
        this.setState({ isLoading: false })
        }
 
      fileReader.readAsDataURL(file)

}

       
  


replaceClick = event => {
  if (event.target.value.length != 0) {
  this.setState({ isLoading: true });
  }

    var file = event.target.files[0];
 
    const fileReader = new FileReader();
 
      fileReader.onerror = (error) => {
        console.log(error)
      }
 
      fileReader.onload = (e) => {
        this.setState({ selectedTrack: file })
        this.setState({ fileContent: e.target.result})
        this.setState({ isLoading: false })
      }
 
      fileReader.readAsDataURL(file);
 
  }



save(event) {
  event.preventDefault();

  let user_id;
  
  let data;

  const { history } = this.props;

  Promise.resolve().then(() => {

 user_id = this.context.user.sub;
  
 data = new FormData()

 data.append('track', this.state.selectedTrack)
 data.append('file', this.state.file)

  var type = "track";
  this.setState(prevState => ({
   trackFields: {...prevState.trackFields, user_id, type, } 
  }))

  data.append('fields', JSON.stringify(this.state.trackFields))
}).then(()=> {
  this.setState({ uploading: true });
  axios.post("/track", data, { 
  }).then(res => { // then print response status
    const { match, location, history } = this.props;
    history.push("/tracks");
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
  let trackFields = this.state.trackFields;
  if(trackFields.date  === "" || trackFields.title  === "" || trackFields.description === "" || this.state.file === null) {
    alert("ERROR: You have data or information that you haven't added");
    } else {
  this.save(event);
}
}

  
  render() {
    console.log("this.context.user.picture" + this.context.user.picture)
    if (this.state.uploading) {
    return (
      <div>
      <h1 style={{marginLeft: "20px", marginTop: "20px"}}>Uploading...</h1>
      </div>

      )
    } else {
    return (
 
      
      <div className="downloadMusic">


      <Container>
      <Row>
      <Col>
 <div>
      {this.state.trackSelected ? (
        <ButtonToggle onClick={this.replaceInput} color="secondary">Replace track
           </ButtonToggle>
           ) : (
            <ButtonToggle onClick={this.clickFileInput} color="secondary">Upload track
           </ButtonToggle> 
        )}
        </div>

        <div className="input">
          <input
            id="upload-file"
            onChange={this.handleClick}
            className="inputName"
            type="file"
            accept="audio/*"
            style={{display:"none"}}
            ref={this.inputRef}
          />
          

          <input
            id="upload-file"
            onChange={this.replaceClick}
            className="inputName"
            type="file"
            accept="audio/*"
            style={{display:"none"}}
            ref={this.replaceInputRef}
          />
          
         
           

 </div>
</Col>
</Row>
     </Container>

     {this.state.trackSelected && 

<div>
      <Container>
          <Row>
          <Col>
                   {this.state.isLoading &&
                   <h4>Uploading... this may take awhile</h4>
                   }
                   <div>
                   <audio src={this.state.fileContent} style={{width:"500px"}} ref={this.audioRef} controls></audio>
                   </div>
      

          </Col>
          </Row>
          </Container>
              
          <Container>                 
           <Row>
           <Col>
          <TrackFields
            beforeImageSave={this.state.beforeImageSave}
            file={this.state.file}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onClick={this.resetFile}
            field={this.state.trackFields}
            fieldChange={this.fieldChange}
          />
        </Col>
        </Row>
        </Container>

                  
                  

      </div>   
                  
  }


        <Container>
        <Row>
        <Col>

        <div className="belowList">{this.state.trackSelected && <div>

           <ButtonToggle onClick={this.onClick} color="success">Save
           </ButtonToggle> 
</div>

}</div>

</Col>
</Row>
</Container>


 

</div>

 
      
    );
   }
  }
}

AddTrack.contextType = Auth0Context;

export default AddTrack;