import React from "react";
import axios, { post } from "axios";
import iniparser from "iniparser";

class SimpleReactFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      console.log(response.data);
    });
  }

  onChange(e) {
    // this.setState({file:e.target.files[0]})
    this.fileUpload(e);
  }

  fileUpload(file) {
    const url = "http://localhost:3000/";
    const formData = new FormData();
    // alert(formData.result);
    const fr = new FileReader();
    formData.append("file", file);
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      const configa = iniparser.parseString(content);
      console.log(configa);
      // Here the content has been read successfuly

      alert(content);
    };
    reader.onerror = function(e) {
      alert(e);
    };
    reader.readAsText(file, "UTF-8");

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    console.log("F", fr, fr.result);
    this.setState({ f: fr });
    console.log(this.state);
    // return  post(url, formData,config)
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={e => this.onChange(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default SimpleReactFileUpload;
