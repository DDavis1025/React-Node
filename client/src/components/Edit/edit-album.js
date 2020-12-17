import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { Delete } from 'styled-icons/typicons/Delete';
import EditFields from './edit-fields';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ButtonToggle, Button } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import auth0Client from "../../Auth";
import { useAuth0 } from "../../react-auth0-spa";
import {Auth0Context} from "../../react-auth0-spa"
import { Auth0Provider } from "../../react-auth0-spa";
import Profile from '../Profile';
import { withRouter } from "react-router";
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
let other;
let secondClickSongs;


class EditAlbum extends Component {
  constructor(props) {
    super(props);

    // this.handleClick = this.handleClick.bind(this);
    // this.save = this.save.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    this.clickAddFiles = this.clickAddFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.downloadChange = this.downloadChange.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.save2 = this.save2.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
    // this.handleAuthentication = this.handleAuthentication.bind(this);
    
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();
    this.removeItem = this.removeItem.bind(this)


    this.state = {
      beforeImageSave: null,
      file: null,
      files: [],
      clicked:false,
      songsList: null,
      songsList2: null,
      albums: {title:"", date:"", description:""},
      album: {},
      afterSlice: [],
      image: {},
      userHasAccess: null,
      loading: true,
    };

  }


  onChange(event) {
    console.log(event.target.files[0])
    this.setState({
      file: event.target.files[0],
      image: event.target.files[0], 
      beforeImageSave: URL.createObjectURL(event.target.files[0]),
      loaded: 0,
    });
    console.log(this.state.file)
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
    const { match: { params} } = this.props;
    let album = this.state.album;
    fetch(`/albums/${params.albumId}`)
    .then((response) =>
      response.json())
    .then((data) => {
      this.setState({ album : data[0], afterSlice: data.slice(1), image: `https://hiphopvolumebucket.s3.amazonaws.com/${data[0].path}` });
      console.log(this.state.afterSlice);
      console.log("user_fields" + JSON.stringify(this.state.album))
      if (this.context.user.sub === this.state.album.author) {
       this.setState({userHasAccess: true})
     }
          // console.log(this.state.afterSlice)
        }).catch((error) => {
          console.log("Error " + error)
        })


      }




      downloadChange (event) {
       const { name, value } = event.target;
       this.setState(prevState => ({
         album: {...prevState.album, [name]: value}
       }));

     }



     changeCursor = (e) => {
      e.target.style.background = 'red';
    }



    


save2(event) {
  event.preventDefault();
  const { match: { params} } = this.props;
  let data;

  console.log(this.state.afterSlice);

  Promise.resolve().then(()=>{
   if(this.state.clicked === true) {
    axios.delete(`/albums/${params.albumId}/songs`)
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
  }

}).then(() => {
  let user_id = this.context.user.sub;
  
  
  console.log(params);

 // let user_id = this.context.user.sub;

 let image = this.state.image;

 data = new FormData();



 this.setState(prevState => ({
  afterSlice: prevState.afterSlice.map((file, index) => ({...file, index})
    )}));
 let afterSlice = this.state.afterSlice;

 console.log(JSON.stringify(afterSlice) + "afterSlice")


 this.setState(prevState => ({
   album: {...prevState.album, afterSlice, user_id}
 }))
}).then(()=> {
  if (other != null || other != undefined) {
    console.log("other if statement")
    Array.from(this.state.songsList).forEach(song => {
      data.append('songs', song);
    })
  }
  console.log("this.state.album" + JSON.stringify(this.state.album))
}).then(()=> {
  
  data.append('album', JSON.stringify(this.state.album))


}).then(()=>{
  // let albums = this.state.albums;
  axios.post(`/albums/${params.albumId}`, data, { 
     }).then(res => { // then print response status
      console.log(res.statusText)
    })
   }).then(()=> {

     data.delete('songs');

     data.append('file', this.state.image)

     axios.put(`/albums/${params.albumId}`, data, { 
     }).then(res => { // then print response status
      console.log(res.statusText)
    })

   }).then(()=> {
    const { match, location, history } = this.props;
    history.push("/");
  }).catch(e => console.log(e));


 }








 
 onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const afterSlice = reorder(
      this.state.afterSlice,
      result.source.index,
      result.destination.index
      );


    this.setState({
      afterSlice,
    });
  }


  removeItem = (index) => {
    this.setState(({ afterSlice }) => ({
      afterSlice: afterSlice.filter((_, ind) => ind !== index) }));
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
    let afterSlice = this.state.afterSlice.slice();
    afterSlice[index].name = event.target.value;
    this.setState({ afterSlice });
  }

  onClick(event) {

  // this.save(event);
  // this.onSubmit(event);
  this.save2(event);
  // this.onClickHandler();

}

deleteClick() {
  const { match, location, history } = this.props;
  const { match: { params} } = this.props;
  var c = window.confirm("Are You Sure You Want To Delete This Post?");
  if (c === true) {
    axios.delete(`/albums/${params.albumId}`)
    .then(res => {
      console.log(res);
      console.log(res.data);
      history.push("/albums");
    })
  }
}

render() {
  console.log(this.state.album.accepted)
  const filesExist = this.state.album;
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
      {this.state.afterSlice.length > 0 &&
        <div>

        <div>


        <EditFields
        beforeImageSave={this.state.beforeImageSave}
        file={this.state.image}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        key={this.state.album.id}
        onClick={this.resetFile}
        album={this.state.album}
        downloadChange={this.downloadChange}
        />

        </div>
        <div> 
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
          {this.state.afterSlice.map((file, index) => (
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
                <p> &nbsp;<input readOnly={true} type="text" value={file.name} name="name" ref={this.fileRef} style={{width:'600px', height:'30px', fontSize: '16px'}}/></p>
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
      <Row>
       <Col>
         {this.state.album.declined && 
          <h3 style={{color:"red"}}>Declined.</h3>
          }
      </Col>
      </Row> 
     <Row>
       <Col>
       {this.state.album.declined && 
             <h6>Please read the terms of service to see what content is accepted</h6>
           }
       </Col>
       </Row>

       </Container>

                </div>

                <div>

                <Container>


                <Row>
                <Col>
                <ButtonToggle onClick={this.onClick} color="success">Save
                </ButtonToggle> 
                </Col>
                </Row>
                <Row>
                <Col>
                <Button color="danger" className="deletePost" size="sm" onClick={this.deleteClick}>Delete</Button>
                </Col>
                </Row>
                </Container>
                </div>
                </div>
              }
              </div>


              );
            }
          }
        }
        EditAlbum.contextType = Auth0Context;

        export default EditAlbum;