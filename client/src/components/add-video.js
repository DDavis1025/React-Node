import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import VideoFields from './videoFields';
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import auth0Client from "../Auth";
import { useAuth0 } from "../react-auth0-spa";
import {Auth0Context} from "../react-auth0-spa"
import { Auth0Provider } from "../react-auth0-spa";
import Profile from './Profile';
import { withRouter } from "react-router";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Link
} from "react-router-dom";


class AddVideo extends Component {
  constructor(props) {
    super(props);
 
    this.handleClick = this.handleClick.bind(this);
    this.replaceClick = this.replaceClick.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.capture = this.capture.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.save = this.save.bind(this);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.dataURItoBlob = this.dataURItoBlob.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();
    this.resetFile = this.resetFile.bind(this);


 
    this.state = {
      file: null,
      selectedVid: null,
      gotCanvasImg: null,
      isLoading: false,
      video: {},
      fileContent: null,
      songsList: null,
      videoSelected: false,
      videoFields: {title:"", date:"", description:""},
      uploading: false
    };
 
  }


  onChange(event) {
    this.setState({
      beforeImageSave: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0],
      loaded: 0,
    });
  }

  resetFile(event) {
    event.preventDefault();
    this.setState({ file: null });
  }

  onClickHandler = () => {
    const data = new FormData()

    
    data.append('file', this.state.file)
    // if (this.state.file !== null && this.state.file.length !== 0) {
    // console.log(this.state.file)
      axios.post("/albums", data, { 
     }).then(res => { // then print response status
      console.log(res.statusText)
 })



console.log("2");
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
   videoFields: {...prevState.videoFields, [name]: value}
   }));

  }
 

handleClick = event => {
  this.setState({ videoSelected: true });
  if (event.target.value.length != 0) {
  this.setState({ isLoading: true });
  }
 
 var file = event.target.files[0];


 
    const fileReader = new FileReader();

      fileReader.onerror = (error) => {
        console.log(error);
      }
      // console.log("video duration before" + video.duration)
      

      fileReader.onload = (e) => {
        this.setState({selectedVid: file})
        this.setState({ fileContent: e.target.result})
        this.setState({ isLoading: false })
        }
 
      fileReader.readAsDataURL(file)

}

       
  


replaceClick = event => {
  if (event.target.value.length != 0) {
  this.setState({ isLoading: true });
  console.log("it worked replace")
  }
  const canvas = this.canvasRef.current;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    var file = event.target.files[0];
 
    const fileReader = new FileReader();
 
      fileReader.onerror = (error) => {
        console.log(error)
      }
 
      fileReader.onload = (e) => {
        this.setState({ selectedVid: file })
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

  // data.append('file', this.state.gotCanvasURL);

  const canvas = this.canvasRef.current;

 data.append('file', this.state.gotCanvasImg, "thumbnail.jpeg")
 data.append('video', this.state.selectedVid)
 console.log("data" + JSON.stringify(data))


}).then(()=> {
  var type = "video";
  this.setState(prevState => ({
   videoFields: {...prevState.videoFields, user_id, type}
}))

  data.append('fields', JSON.stringify(this.state.videoFields))
}).then(()=> {
  this.setState({ uploading: true });
  axios.post("/video", data, { 
  }).then(res => { // then print response status
    const { match, location, history } = this.props;
    history.push("/videos");
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
  let videoFields = this.state.videoFields;
  if(videoFields.date  === "" || videoFields.title  === "" || videoFields.description === "" || this.state.gotCanvasImg === null) {
    alert("ERROR: You have data or information that you haven't added");
    } else {
  this.save(event);
}
}

  capture() {
    const canvas = this.canvasRef.current;
    const video = this.videoRef.current;
    var c = canvas, v = video;
   
    var vRatio = (c.height / v.videoHeight) * v.videoWidth;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, c.width / 2 - vRatio / 2, c.height / 2 - c.height / 2, vRatio, c.height);

    // canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
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
  
  render() {
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
      {this.state.videoSelected ? (
        <ButtonToggle onClick={this.replaceInput} color="secondary">Replace video
           </ButtonToggle>
           ) : (
            <ButtonToggle onClick={this.clickFileInput} color="secondary">Upload video
           </ButtonToggle> 
        )}
        </div>

        <div className="input">
          <input
            id="upload-file"
            onChange={this.handleClick}
            className="inputName"
            type="file"
            accept="video/*"
            style={{display:"none"}}
            ref={this.inputRef}
          />
          

          <input
            id="upload-file"
            onChange={this.replaceClick}
            className="inputName"
            type="file"
            accept="video/*"
            style={{display:"none"}}
            ref={this.replaceInputRef}
          />
          
         
           

 </div>
</Col>
</Row>
     </Container>

     {this.state.videoSelected && 

<div>
      <Container>
          <Row>
          <Col>
                   {this.state.isLoading &&
                   <h4>Uploading... this may take awhile</h4>
                   }
                   <div>
                   <video src={this.state.fileContent} width="640" height="360" ref={this.videoRef} controls></video>
                   </div>
                   <button onClick={this.capture}>Capture Thumbnail</button> <br/><br/>
                   <canvas width="320" height="180" style={{border: "1px solid black"}} ref={this.canvasRef}></canvas>

          </Col>
          </Row>
          </Container>
              
          <Container>                 
           <Row>
           <Col>
          <VideoFields
            file={this.state.file}
            onChange={this.onChange}
            onClick={this.resetFile}
            video={this.state.videoFields}
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

        <div className="belowList">{this.state.videoSelected && <div>

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

AddVideo.contextType = Auth0Context;

export default AddVideo;