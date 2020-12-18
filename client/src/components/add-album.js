import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { Delete } from 'styled-icons/typicons/Delete';
import Downloaded from './downloaded';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
// import auth0 from 'auth0-js';

 
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
 
  return result;
};
 
const grid = 3;
 
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
 
  background: isDragging ? "blue" : "white",
 
  ...draggableStyle
});
 
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightgrey" : "lightgrey",
  padding: grid,
  width: 700,
});
 
const Handle = styled.div`
width: 20px;
height: 20px;
margin-top: 7.5px;
background-color: gray;
border-radius: 4px;
float: left;
`
const LIDelete = styled(Delete)`
width: 20px;
height: 20px;
color: gray;
float: right;
margin-top: -50px;
`

let id = 0;
let clicked = false;
let imageReplaced = false;


class AddAlbum extends Component {
  constructor(props) {
    super(props);
 
    this.handleClick = this.handleClick.bind(this);
    this.replaceClick = this.replaceClick.bind(this);
    // this.save = this.save.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.secondInputClick = this.secondInputClick.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    this.clickAddFiles = this.clickAddFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.downloadChange = this.downloadChange.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.save2 = this.save2.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();
    this.resetFile = this.resetFile.bind(this);
    this.removeItem = this.removeItem.bind(this)

 
    this.state = {
      beforeImageSave: null,
      file: null,
      files: [],
      songsList: [],
      albums: {title:"", date:"", description:""},
      uploading: false,
    };
 
  }


  onChange(event) {
    console.log(event.target.files[0])
    this.setState({
      beforeImageSave: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0],
      loaded: 0,
    });
    console.log(this.state.file)
    imageReplaced = true;
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

}
 

  componentDidMount() {
    let value = this.context;
  // auth0Client.handleAuthentication();
    console.log(value);
    console.log(this.props.myHookValue);
   
  }

  componentDidUpdate() {
     {this.context.user && console.log(this.context.user.sub)}
  // {this.state.user.sub !== undefined &&
  // console.log(this.context.user.sub)}
  
}

  


downloadChange (event) {
   const { name, value } = event.target;
   this.setState(prevState => ({
   albums: {...prevState.albums, [name]: value}
   }));

  }


 
changeCursor = (e) => {
    e.target.style.background = 'red';
  }
 

handleClick = event => {
  
  // Helper code to read file and return promise
  const readFile = (file) => {
 
    // const fileList = [];

 
    const fileReader = new FileReader();
 
    // create the promise and return it
    return new Promise((resolve, reject) => {
 
      // if file reader has an error, report it
      fileReader.onerror = (error) => {
        reject({ error })
      }
 
      // if success, resolve the promise
      fileReader.onload = (e) => {
        resolve({
          name: file.name.replace( /_|\.mp3/gi, " "),
          id: id++,
         
        })
      }
 
      // start reading the file
      fileReader.readAsArrayBuffer(file);
 
    })
  }

 
 
  // create all the file reader promises
  // create an array from the files list and use map to generate
  // an array of promises
  const allReaders = Array.from(event.target.files).map(readFile)

  const other = event.target.files;


  // console.log(other);

Promise.resolve().then(() => {
this.setState({songsList : other})
}).then(()=> {
console.log(this.state.songList)
}).catch((error) => {
  console.log(error);
})
   

 
  
 
  // Now handle the array of promises we just created
  Promise.all(allReaders)
    .then(fileList => {
      console.log("fileList" + JSON.stringify(fileList))
      // set the state that we have all the files
      this.setState({ files: fileList });
       console.log(this.state.files)
    })
    .catch(error => {
       console.error(error)
    });
    
}



replaceClick = event => {
  const readFile = (file) => {
 
    // const fileList = [];
 
    const fileReader = new FileReader();
 
    // create the promise and return it
    return new Promise((resolve, reject) => {
 
      // if file reader has an error, report it
      fileReader.onerror = (error) => {
        reject({ error })
      }
 
      // if success, resolve the promise
      fileReader.onload = (e) => {
        resolve({
          name: file.name.replace( /_|\.mp3/gi, " "),
          id: id++,
         
        })
      }
 
      // start reading the file
      fileReader.readAsDataURL(file);
 
    })
  }

const other = event.target.files;

Promise.resolve().then(() => {
this.setState({songsList : other})
}).then(()=> {
console.log(this.state.songList)
}).catch((error) => {
  console.log(error);
})
 
 
  // create all the file reader promises
  // create an array from the files list and use map to generate
  // an array of promises
  const allReaders = Array.from(event.target.files).map(readFile)

 
  // Now handle the array of promises we just created
  Promise.all(allReaders)
    .then(fileList => {
      console.log(this.state.files)
      // set the state that we have all the files
      this.setState({ files: fileList });
    })
    .catch(error => {
       console.error(error)
    });
    
    clicked = true;
}


secondInputClick = event => {
  // Helper code to read file and return promise
  const readFile = (file) => {
 
    // const fileList = [];
 
    const fileReader = new FileReader();
 
    // create the promise and return it
    return new Promise((resolve, reject) => {
 
      // if file reader has an error, report it
      fileReader.onerror = (error) => {
        reject({ error })
      }
 
      // if success, resolve the promise
      fileReader.onload = (e) => {
        resolve({
          name: file.name.replace( /_|\.mp3/gi, " "),
           id: id++,
        })
      }
 
      // start reading the file
      fileReader.readAsDataURL(file);
 
    })
  }
const other = event.target.files;
 
Promise.resolve().then(() => {
this.setState(prevState => ({ ...prevState, songsList: [...prevState.songsList,  ...other ]}));
}).then(()=> {
console.log(this.state.songList)
}).catch((error) => {
  console.log(error);
})
 
  // create all the file reader promises
  // create an array from the files list and use map to generate
  // an array of promises
  const allReaders = Array.from(event.target.files).map(readFile)
 
  // Now handle the array of promises we just created
  Promise.all(allReaders)
    .then(fileList => {
      console.log(this.state.files)
      // set the state that we have all the files
      this.setState(prevState => ({ ...prevState, files: [...prevState.files,  ...fileList ]}));
    })
    .catch(error => {
       console.error(error)
    });

 
}



save2(event) {
  event.preventDefault();

  let user_id;

  let image;
  
  let data;

  const { history } = this.props;

  Promise.resolve().then(()=>{

  user_id = this.context.user.sub;

  image = this.state.file;
  
  data = new FormData()

  data.append('file', this.state.file)


  console.log(data);
    
}).then(()=> {
  
  this.setState(prevState => ({
  files: prevState.files.map((file, index) => ({...file, index})
)}));
  let files = this.state.files;
   
   var type = "album";
   this.setState(prevState => ({
   albums: {...prevState.albums, files, user_id, type}
}))

   Array.from(this.state.songsList).forEach(song => {
    data.append('songs', song)
  })

  data.append('albums', JSON.stringify(this.state.albums))

  console.log("this.state.albums" + JSON.stringify(this.state.albums))


}).then(()=> {
  this.setState({ uploading: true });
  console.log("data" + JSON.stringify(data))
    axios.post("/albums", data, { 
  }).then(res => { // then print response status
    console.log(res.statusText)
    const { match, location, history } = this.props;
    history.push('/albums');

 })
}).catch((err)=> {console.log(err)});

}


  





 
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
 
    const files = reorder(
      this.state.files,
      result.source.index,
      result.destination.index
    );

    const songsList = reorder(
      this.state.songsList,
      result.source.index,
      result.destination.index
    );

    this.setState({
      songsList,
      files
    });
  }
 
 
  removeItem = (index) => {
    this.setState(({ files }) => ({
      files: files.filter((_, ind) => ind !== index) }));
    this.setState(({ songsList }) => ({
      songsList: songsList.filter((_, ind) => ind !== index) }));
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

  handleChange(index, event) {
    let files = this.state.files.slice();
    files[index].name = event.target.value;
    this.setState({ files: files });
  }

onClick(event) {
  let albums = this.state.albums;
  if(albums.date  === "" || albums.title  === "" || albums.description === "" || this.state.file === null) {
    alert("ERROR: You have data or info you haven't added");
    } else {
  this.save2(event);
}
}
  

  render() {
    console.log("this.state.files" + JSON.stringify(this.state.files)) 
    // var that = this; 
    const filesExist = this.state.files;
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
      {filesExist != 0 ? (
        <ButtonToggle onClick={this.replaceInput} color="secondary">Replace Music Files
           </ButtonToggle>
           ) : (
            <ButtonToggle onClick={this.clickFileInput} color="secondary">Upload Songs
           </ButtonToggle> 
        )}
        </div>

        <div className="input">
          <input
            accept="audio/*"
            id="upload-file"
            onChange={this.handleClick}
            className="inputName"
            type="file"
            multiple
            style={{display:"none"}}
            ref={this.inputRef}
          />
          

          <input
            accept="audio/*"
            id="upload-file"
            onChange={this.replaceClick}
            className="inputName"
            type="file"
            multiple
            style={{display:"none"}}
            ref={this.replaceInputRef}
          />
          
         
           

 </div>
</Col>
</Row>
     </Container>
   
          <div>{this.state.files.length > 0 && 
          <Downloaded
            beforeImageSave={this.state.beforeImageSave}
            file={this.state.file}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            key={this.state.albums.id}
            onClick={this.resetFile}
            album={this.state.albums}
            downloadChange={this.downloadChange}
          />
        }</div>

         

          <Container>
          <Row>
          <Col>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.files.map((file, index) => (
                  <Draggable key={file.id.toString()} draggableId={file.id.toString()} index={index} style={{marginTop:"400px"}}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
 
                       
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                      
                      <div className="handle">
                      <Handle {...provided.dragHandleProps}/>
                      </div>
                    
                      
                      <div>
                      
                         <form>
                   
  <label>
   <p> &nbsp;<input type="text" value={file.name} onChange={this.handleChange.bind(this, index)} name="name" ref={this.fileRef} style={{width:'600px', height:'30px', fontSize: '16px'}} /></p>
  </label>

</form>

 
                      </div>  
                      
                  
                      <div className="delete">
                       <LIDelete onClick = {() => this.removeItem(index)}/>
                       </div>
                      
                     </div>
                     
                     
                    )}
                  </Draggable>
 
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
</Col>
</Row>
</Container>

<Container>

        <div className="belowList">{this.state.files.length > 0 && <div>
<Row>
<Col>

  <ButtonToggle onClick={this.clickAddFiles} color="secondary">Add More Files
           </ButtonToggle> 
       <input
            accept="audio/*"
            onChange={this.secondInputClick}
            id="second-input"
            className="inputName"
            type="file"
            multiple
            style={{display:"none"}}
            ref={this.addFiles}
            />
            </Col>
            </Row>
        


            
         

         <Row>
         <Col>
           <ButtonToggle onClick={this.onClick} color="success">Save
           </ButtonToggle> 
           </Col>
         </Row>

         <Row>
         <Col>
           <h8>By uploading content onto this Website and App, you grant Hip-Hop Volume LLC a worldwide, non-exclusive, perpetual, sub-licensable, royalty-free license to reproduce, publish and distribute the content on or in connection with this site or service.</h8>
           </Col>
         </Row>
         
</div>



}</div>




</Container>



 

</div>

 
    
    );
  }
  }
}
AddAlbum.contextType = Auth0Context;
 
export default AddAlbum;