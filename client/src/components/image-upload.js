import React from 'react';
import ReactDom from 'react-dom';
import { ButtonToggle } from "reactstrap";



class ImageUpload extends React.Component {

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
        <img style={{ width: "300px", height: "300px"}} src={this.props.file[0] ? "http://localhost:3000/" + this.props.file[0].path : this.props.beforeImageSave} />
        )}
        </div>

        {this.props.file && this.props.file.length !== 0 && (
          <div>
           <ButtonToggle onClick={this.props.onClick} color="danger" size="sm">Remove Image
        </ButtonToggle> 
           
          </div>
        )}
      </div>
     
    );
  }
}

export default ImageUpload;