import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import EditVideoFields from './edit-videoFields'
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import Profile from '../Profile';
import { withRouter } from "react-router";
import { Button } from "reactstrap";
import {
 BrowserRouter as Router,
 Switch,
 Route,
 Link
} from "react-router-dom";


class EditVideo extends Component {
  constructor(props) {
    super(props);

    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.capture = this.capture.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.save = this.save.bind(this);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.dataURItoBlob = this.dataURItoBlob.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();


    this.state = {
      gotCanvasImg: null,
      requestDone: false,
      user_video: {},
      user_fields: {},
      user_image: {},
      userHasAccess: false,
    };

  }



  componentDidMount() {
    let value = this.context;
  // auth0Client.handleAuthentication();
  console.log(value);
  console.log(this.props.myHookValue);
  const { match: { params} } = this.props;
  let user_fields = this.state.user_fields;
  let user_video = this.state.user_video;
  let user_image = this.state.user_image;
  fetch(`/video/${params.videoId}`)
  .then((response) =>
    response.json())
  .then((data) => {
    console.log("data" + JSON.stringify(data))
    this.setState({ user_fields : data[0], user_video: data[1], user_image: data[2] });
 }).then(() => {
   console.log("user_fields" + JSON.stringify(this.state.user_fields))
   if (this.context.user.sub === this.state.user_fields.author) {
     this.setState({userHasAccess: true})
   }
   console.log("user.sub" + this.context.user.sub + "user.author" + user_fields.author)
   const canvas = this.canvasRef.current;
   var img = new Image();
   img.src = "https://hiphopvolumebucket.s3.amazonaws.com/" + this.state.user_image.path;
   img.crossOrigin = "anonymous"
   var ctx = canvas.getContext('2d');
   img.onload = function(){
     ctx.drawImage(img, 0, 0);
   }
   this.setState({ requestDone: true });
          // console.log(this.state.afterSlice)
        }).catch((error) => {
          console.log("Error " + error)
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

  let data;

  const { match: { params} } = this.props;

  Promise.resolve().then(() => {

  data = new FormData()

  // data.append('file', this.state.gotCanvasURL);
  if (this.state.gotCanvasImg != null) {
  data.append('file', this.state.gotCanvasImg, "thumbnail.jpeg");
  }
  data.append('fields', JSON.stringify(this.state.user_fields))
}).then(()=> {
  axios.put(`/video/${params.videoId}`, data, { 
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
  let videoFields = this.state.user_fields;
  if(videoFields.date  === "" || videoFields.title  === "" || videoFields.description === "") {
    alert("ERROR: You have data or information that you haven't added");
  } else {
    this.save(event);
  }
}



capture() {
  this.setState({thumbnailSelected: true});
  const canvas = this.canvasRef.current;
  const video = this.videoRef.current;
  var c = canvas, v = video;

  var vRatio = (c.height / v.videoHeight) * v.videoWidth;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, c.width / 2 - vRatio / 2, c.height / 2 - c.height / 2, vRatio, c.height);
  var blob = this.dataURItoBlob(canvas.toDataURL());
  this.setState({
    gotCanvasImg: blob,
    loaded: 0,
  })
}

dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(dataURI.split(',')[1]);
    }

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  deleteClick() {
  const { match, location, history } = this.props;
  const { match: { params} } = this.props;
  var c = window.confirm("Are You Sure You Want To Delete This Post?");
  if (c === true) {
  axios.delete(`/video/${params.videoId}`)
      .then(res => {
        console.log(res)
        history.push("/videos");
      }).catch((err)=>{
        console.log("Error deleting video" + err)
      })
    }
  }
  
  render() {
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

      <Container>
      <Row>
      <Col>
      <div>
      <video src={"https://hiphopvolumebucket.s3.amazonaws.com/" + this.state.user_video.path} width="640" height="360" ref={this.videoRef} crossOrigin="anonymous" controls></video>
      </div>
      <button onClick={this.capture}>Capture Thumbnail</button> <br/><br/>
      <canvas width="320" height="180" style={{border: "1px solid black"}} ref={this.canvasRef}></canvas>

      </Col>
      </Row>
      </Container>

      {this.state.requestDone && 
        <Container>                 
        <Row>
        <Col>
        <EditVideoFields
        onChange={this.onChange}
        onClick={this.resetFile}
        video={this.state.user_fields}
        fieldChange={this.fieldChange}
        />

        </Col>
        </Row>
        </Container>
      }

     <Container>
      <Row>
       <Col>
         {this.state.user_fields.declined && 
          <h3 style={{color:"red"}}>Declined.</h3>
          }
      </Col>
      </Row> 
     <Row>
       <Col>
       {this.state.user_fields.declined && 
             <h6>Please read the terms of service to see what content is accepted</h6>
           }
       </Col>
       </Row>

       </Container>






      <Container>
      
      <div className="belowList">

      <Row>
      <Col>
      <ButtonToggle onClick={this.onClick} color="success">Save
      </ButtonToggle>
      </Col>
      </Row> 

      <Row>
      <Col>
           <Button className="deletePost" color="danger" size="sm" onClick={this.deleteClick}>Delete</Button>
      </Col>
      </Row>
      </div>

    
      </Container>




      </div>


      
      );
     }
    }
  }

  EditVideo.contextType = Auth0Context;

  export default EditVideo;