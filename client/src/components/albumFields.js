import React, { Component } from "react";
import ReactDOM from "react-dom";
import Album from './album';
import { Container } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class AlbumFields extends Component {
  constructor(props) {
    super(props);

}

render() {
 return(
 
        
        <Container>
	      <Form className="form">
         <FormGroup row>
          <Label for="title">Title:</Label>

           <Input type="text" name="title" id="title" placeholder="Title(Beginning with Artist name -)"  value={this.props.album.title} onChange={this.props.downloadChange}/>

        </FormGroup>
        <FormGroup row>
         <Label for="date">Date:</Label>
           <Input type="date" name="date" id="date" placeholder="Date" value={this.props.album.date} onChange={this.props.downloadChange}/>
       
        </FormGroup>
        <FormGroup row>
        <Label for="description">Description:</Label>
          <Input type="textarea" name="description" id="description" value={this.props.album.description} placeholder="Description" onChange={this.props.downloadChange}/>
       
       </FormGroup>
       </Form>
	    </Container>

    );
  }
};

export default AlbumFields;