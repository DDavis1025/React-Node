import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, CardLink, Button
} from 'reactstrap';


class Feed extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      album: {},
    };

}

  componentDidMount() {
  this._isMounted = true;
  console.log('COMPONENT HAS MOUNTED');
  let album = this.state.album;
  fetch(`http://localhost:8000/albums`)
    .then((response) =>
      response.json())
    .then((data) => {
          this.setState({ album : data });

     }).catch((error) => {
            console.log("Error " + error)
          })

  }

componentDidUpdate() {
this._isMounted = false;
// fetch(`http://localhost:8000/albums`)
// .then((response) =>
//   response.json())
// .then((data) => {
//       this.setState({ album : data });
//  }).catch((error) => {
//         console.log("Error " + error)
//       })
}

  // componentWillUnmount() {
  //   this._isMounted = false;
  // }





render() {
return (
<div>
<ul>
 
          {this.state.album.length && this.state.album.map((album,index) => {
            return ( 
              
            <div key={index}>
             <Row>
              <Col xs="8">
              <CardLink href={`/album/${album.id}`}>
               <Card>
               <CardBody>
               <CardTitle>
               <b>Title: </b>
               {album.title}
               </CardTitle>
               </CardBody>
               <CardBody>
              <CardImg style={{ width: "300px", height: "300px"}} src={album.path}>
            </CardImg>
            </CardBody>
            <CardBody>
              <CardText><b>Desription: </b>{album.description}</CardText>
            </CardBody>
            </Card>
            </CardLink>
            </Col>
            </Row>
            </div>
            )
          })}

</ul>
</div>
);
}
};


export default Feed;
