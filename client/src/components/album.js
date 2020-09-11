import React, { Component } from "react";
import ReactDOM from "react-dom";
import AlbumFields from './albumFields';
import { ButtonToggle } from "reactstrap";
import { Media } from 'reactstrap';
import {Auth0Context} from "../react-auth0-spa"
import { Auth0Provider } from "../react-auth0-spa";
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from "react-router";

var imgStyle = {
  width:"230px",
  height:"230px",
};



class Album extends Component {
  constructor(props) {
    super(props);

    this.deleteClick = this.deleteClick.bind(this);

    this.state = {
      albums: {},
      album: {},
      songs: {},
      audio: '',
      loading: false,
    };
 
  }

  
  componentDidMount() {
  const { match: { params} } = this.props;
  console.log('COMPONENT HAS MOUNTED');

this.setState({ loading : true });
let albums = this.state.albums;
  fetch(`http://localhost:8000/albums/${params.albumId}`)
    .then((response) =>
      response.json())
    .then((data) => {
          this.setState({ songs : data.slice(1), album: data[0] });
        }).catch((error) => {
            console.log("Error " + error)
          }).finally(()=> {
    this.setState({ loading : false });
  })
}

deleteClick() {
  const { match, location, history } = this.props;
  const { match: { params} } = this.props;
  var c = window.confirm("Are You Sure You Want To Delete This Post?");
  if (c === true) {
  axios.delete(`http://localhost:8000/albums/${params.albumId}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        history.push("/feed");
      })
    }
  }


  render() {
    let {loading} = this.state;
    const { match: { params} } = this.props;

    let user_id = this.context.user ? this.context.user.sub : null;
    let author_id = this.state.album ? this.state.album.author : null;

    let shouldRenderButton = user_id && author_id && user_id === author_id;
   
  

    

    // let author_id = "";
    // let user_id="";
    // if(this.state.albums[0]){ 
    //   author_id = this.state.albums[0].author 
    //   console.log(author_id);
    // } 
    // if(this.context.user){ 
    //   user_id = this.context.user.sub 
    //   console.log(user_id);
    // }
  //   console.log(this.state.albums);
  //   if(this.state.albums[0]){
  //   let author_id = this.state.albums[0].author;
  //   console.log(author_id);
  //   }
  //   if(this.context.user){
  //   let user_id = this.context.user.sub;
  //   console.log(user_id);
  // }


    
    return (
      
      <div>
      {this.state.songs.length > 0 &&
     <div>
      <Media>
      <Media left>
        <Media style={imgStyle} object src={this.state.album.path} alt="Generic placeholder image" />
      </Media>
      <Media body>
        <Media heading>
          <b>Title:</b> {this.state.album.title}
        </Media>
        <h6><b>Release Date:</b> {this.state.album.date.slice(0,10)}</h6>
        <p><b>Description:</b> {this.state.album.description}</p>
        </Media>
        </Media>


 <div className="audio-player">
       <audio
       controls
       autoPlay
       type="audio/mpeg"
       src={"http://localhost:3000/" + this.state.audio}
        />
         </div>

        <div>
         <ul ref={this.ulRef}>
            {this.state.songs.map((album, index) => (
              <li key={index} onClick={(e) => {
                  e.preventDefault();
                  this.setState({ audio: album.path })
                  }}>
                  <a href={album.path}>{album.name}</a>
              </li>
            ))}
          </ul>

        </div>
        </div>}
<div>
    {shouldRenderButton &&
    <Container>
    <Row>
    <Link to={`/${params.albumId}/edit`}>
    <Button color="primary" size="sm">Edit</Button>
    </Link>
    </Row>
    <Row>
    <Button color="danger" size="sm" onClick={this.deleteClick}>Delete</Button>
    </Row>
    </Container>
    }

</div>

      </div>
    )

  }
}
Album.contextType = Auth0Context;
 
export default Album;