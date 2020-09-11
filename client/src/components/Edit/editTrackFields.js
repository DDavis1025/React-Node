import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import EditTrackImage from './editTrackImage';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class EditTrackFields extends Component {
  constructor(props) {
    super(props);

}

render() {
  console.log("this.props.fields" + JSON.stringify(this.props.field))
 return(
 	
		<div className="main-content">
        
        <Container>
		    <div className="container">
		        <Row>
            <Col className="track_image_col">
		        <div className="image"><EditTrackImage file={this.props.file} beforeImageSave={this.props.beforeImageSave} onChange={this.props.onChange} onClick={this.props.onClick}/></div>
		        </Col>
            </Row>
            
     <Row className="track_fields_row">
		  <Col className="track_fields">
	    <Form onSubmit={this.props.onSubmit} className="form">
      <FormGroup row>
        <Label for="title">Title:</Label>


        
          <Input type="text" name="title" id="title" placeholder="Title" value={this.props.field.title} onChange={this.props.fieldChange}/>
        
      </FormGroup>
      <FormGroup row>
        <Label for="date">Date:</Label>
       
          <Input type="date" name="date" id="date" placeholder="Date" value={this.props.field.date.slice(0, 10)} onChange={this.props.fieldChange} required="required"/>
       
      </FormGroup>
      <FormGroup row>
        <Label for="description">Description:</Label>
        
          <Input type="textarea" rows="4" cols="50" name="description" id="description" placeholder="Description" value={this.props.field.description} onChange={this.props.fieldChange}/>
       
      </FormGroup>

   
      </Form>
						</Col>
						</Row>
					</div>


					


            
			</Container>


		</div>





    );

}
};

export default EditTrackFields;