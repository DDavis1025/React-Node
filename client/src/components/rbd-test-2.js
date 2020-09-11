import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { Delete } from 'styled-icons/typicons/Delete';
import Downloaded from './downloaded';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ButtonToggle } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
 
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
 
  return result;
};
 
const grid = 8;
 
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
margin-top: -28px;
`

let id = 0;
let clicked = false;


class AddAlbum extends Component {
  constructor(props) {
    super(props);
 
    this.handleClick = this.handleClick.bind(this);
    this.replaceClick = this.replaceClick.bind(this);
    this.save = this.save.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.secondInputClick = this.secondInputClick.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);
    this.clickAddFiles = this.clickAddFiles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.downloadChange = this.downloadChange.bind(this);
    
    this.replaceInputRef = React.createRef();
    this.fileRef = React.createRef();
    this.inputRef = React.createRef();
    this.addFiles = React.createRef();
    this.removeItem = this.removeItem.bind(this)
 
    this.state = {
      files: [],
      albums: [],
    };
 
  }


  
  componentDidMount() {
  const { match: { params} } = this.props;
  console.log('COMPONENT HAS MOUNTED');
  let files = this.state.files;
  let albums = this.state.albums;
  fetch('http://localhost:3000/songs')
    .then((response) =>
      response.json())
    .then((data) => {
          console.log(data)
          this.setState({files : data });
          console.log(this.state.files)
        }).catch((error) => {
            console.log("Error " + error)
          })

    fetch(`http://localhost:3000/albums/${params.albumId}`)
    .then((response) =>
      response.json())
    .then((data) => {
          console.log(data)
          this.setState({albums : data});
          console.log(this.state.albums)
          console.log(this.state.albums[0].title)
        }).catch((error) => {
            console.log("Error " + error)
          })
}

downloadChange (event) {
   const { name, value } = event.target;
   this.setState(prevState => ({
   albums: {...prevState.albums, [name]: value }
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
          link: e.target.result,
          id: id++,
         
        })
      }
 
      // start reading the file
      fileReader.readAsDataURL(file);
 
    })
  }

 
 
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
          link: e.target.result,
          id: id++,
         
        })
      }
 
      // start reading the file
      fileReader.readAsDataURL(file);
 
    })
  }

 
 
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
          link: e.target.result,
           id: id++,
        })
      }
 
      // start reading the file
      fileReader.readAsDataURL(file);
 
    })
  }

 
 
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






save(event) {
   event.preventDefault();
   var that = this;
   let files = this.state.files;
   let albums = this.state.albums;
   let other = this.props.title;


   console.log(albums);
   console.log(this.state)

   let p = new Promise((resolve, reject) => {
    resolve('Success');
   })

.then(() => {
   if(clicked === true) {
    console.log("replace click");
    clicked = false;
    let dltRequest = new Request('http://localhost:3000/songs/:' +  id, {
    method: 'DELETE',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });

    fetch(dltRequest)
      .then((response) =>
        response.json())
          .then((data) => {
          })
          .catch((error) => {
            console.log(error)
          })
    }
}).then(() => {
   let data = files.map(( { name }  , index) => ({ name, index : index }));
     
     
     console.log(data);
     console.log(files);
    
    let request = new Request('http://localhost:3000/songs', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
    });


    fetch(request)
      .then((response) =>
        response.json())
          .then((data) => {
          })
          .catch((error) => {
            console.log(error)
          })

    let albumRequest = new Request('http://localhost:3000/albums', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(albums),
    });


    fetch(albumRequest)
      .then((response) =>
        response.json())
          .then((data) => {
          })
          .catch((error) => {
            console.log(error)
          })

    
    
    let putRequest = new Request('http://localhost:3000/songs/:' +  id, {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });

    fetch(putRequest)
      .then((response) =>
        response.json())
          .then((data) => {
          })
          .catch((error) => {
            console.log(error)
          })
}).catch((error) =>{
    console.log(error);
})

     
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
 
    this.setState({
      files
    });
  }
 
 
  removeItem = (index) => {
    this.setState(({ files }) => ({
      files: files.filter((_, ind) => ind !== index) }));
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

  

  render() {
 
    // var that = this;
    
    const filesExist = this.state.files;
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
            <ButtonToggle onClick={this.clickFileInput} color="secondary">Upload Files
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
   
          <div>{this.state.files.length > 0 &&  this.state.albums.map(album => (
          <Downloaded
            key={album.id}
            album={album}
            downloadChange={this.downloadChange}
          />
        ))}</div>

         

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
            </div>


            
          }</div>

         
         <Row>
         <Col>
           <ButtonToggle onClick={this.save} color="success">Save
           </ButtonToggle> 
           </Col>
         </Row>
</Container>
      </div>


      
    );
  }
}
 
 
export default AddAlbum;