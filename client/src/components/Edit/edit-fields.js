import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import EditImage from './edit-image';
import EditAlbum from './edit-album';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class EditFields extends Component {
  constructor(props) {
    super(props);

}

render() {

 return(
 	
		<div className="main-content">
        
        <Container>
		    <div className="container">
		        <div className="downloaded">
		        <Row className="downloaded-row">
            <Col className="">
		        <div className="image"><EditImage file={this.props.file} beforeImageSave={this.props.beforeImageSave} onChange={this.props.onChange} onClick={this.props.onClick}/></div>
		        </Col>
            </Row>
            <Row className="album_fields_row">
		        <Col className="">
	<Form onSubmit={this.props.onSubmit} className="form">
      <FormGroup row>
        <Label for="title">Title:</Label>


        
          <Input type="text" name="title" id="title" placeholder="Title" value={this.props.album.title} onChange={this.props.downloadChange}/>
        
      </FormGroup>
      <FormGroup row>
        <Label for="date">Date:</Label>
       
          <Input type="date" name="date" id="date" placeholder="Date" value={this.props.album.date.slice(0, 10)} onChange={this.props.downloadChange} required="required"/>
       
      </FormGroup>
      <FormGroup row>
        <Label for="description">Description:</Label>
        
          <Input type="textarea" rows="4" cols="50" name="description" id="description" placeholder="Description" value={this.props.album.description} onChange={this.props.downloadChange}/>
       
      </FormGroup>

   
      </Form>
						</Col>
						</Row>
					</div>


					


            
			</div>
			</Container>


		</div>





    );

}
};

export default EditFields;