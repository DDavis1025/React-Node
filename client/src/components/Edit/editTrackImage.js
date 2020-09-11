import React from 'react';
import ReactDom from 'react-dom';
import { ButtonToggle } from "reactstrap";



class EditTrackImage extends React.Component {

 constructor(props) {
    super(props);
    this.clickAddImage = this.clickAddImage.bind(this);
    this.imageRef = React.createRef();
  }
 
  clickAddImage () {
    this.imageRef.current.click();
  }

  render() {
    return (
      
      <div>
      <label>
      <ButtonToggle onClick={this.clickAddImage} outline color="secondary">Add Image
        </ButtonToggle> 
        <input type="file"  style={{display:"none"}} accept="image/*" ref={this.imageRef} onChange={this.props.onChange} />
        </label>

         
        
        <div className="image" style={{ width: '300px', height: '300px', 
            border: '1px dotted black'}}>
        {this.props.file && (
        <img style={{ width: "300px", height: "300px"}} src={this.props.beforeImageSave ? this.props.beforeImageSave : this.props.file} />
        )}
        </div>

        
      </div>
     
    );
  }
}

export default EditTrackImage;