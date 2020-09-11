import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import EditVideo from './edit-video'
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class EditVideoFields extends Component {
  constructor(props) {
    super(props);

}

render() {
 return(
 	
		<div className="main-content">
        
        <Container>
		    <div className="container">
		        <div className="downloaded">
		        <Row className="video_fields_row">
		        <Col className="">
	<Form onSubmit={this.props.onSubmit} className="form">
      <FormGroup row>
        <Label for="title">Title:</Label>


        
          <Input type="text" name="title" id="title" placeholder="Title" value={this.props.video.title} onChange={this.props.fieldChange}/>
        
      </FormGroup>
      <FormGroup row>
        <Label for="date">Date:</Label>
       
          <Input type="date" name="date" id="date" placeholder="Date" value={this.props.video.date.slice(0, 10)} onChange={this.props.fieldChange} required="required"/>
       
      </FormGroup>
      <FormGroup row>
        <Label for="description">Description:</Label>
        
          <Input type="textarea" rows="4" cols="50" name="description" id="description" placeholder="Description" value={this.props.video.description} onChange={this.props.fieldChange}/>
       
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

export default EditVideoFields;