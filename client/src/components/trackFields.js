import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import ImageUpload from './image-upload';
import AddAlbum from './add-album';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


class TrackFields extends Component {
  constructor(props) {
    super(props);

}

render() {
  let string = "Title(Beginning with your" + "\"Artist name\"" + "-" + ")"
 return(
 	
		<div className="main-content">
        
        <Container>
		    <div className="container">
		        <div className="downloaded">
		        <Row>
            <Col className="">
		        <div className="image"><ImageUpload file={this.props.file} beforeImageSave={this.props.beforeImageSave} onChange={this.props.onChange} onClick={this.props.onClick}/></div>
		        </Col>
            </Row>
            <Row className="track_fields_row">
		        <Col className="">
	<Form onSubmit={this.props.onSubmit} className="form">
      <FormGroup row>
        <Label for="title">Title:</Label>


        
          <Input type="text" name="title" id="title" placeholder="Title(Beginning with Artist name -)" value={this.props.field.title} onChange={this.props.fieldChange}/>
        
      </FormGroup>
      <FormGroup row>
        <Label for="date">Date:</Label>
       
          <Input type="date" name="date" id="date" placeholder="Date" value={this.props.field.date.slice(0, 10)} onChange={this.props.fieldChange} required="required"/>
       
      </FormGroup>
      <FormGroup row>
        <Label for="description">Description:</Label>
        
          <Input rows="4" cols="50" type="textarea" name="description" id="description" placeholder="Description" value={this.props.field.description} onChange={this.props.fieldChange}/>
       
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

export default TrackFields;