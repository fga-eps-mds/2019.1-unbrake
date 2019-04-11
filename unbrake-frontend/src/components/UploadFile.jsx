import React from "react";
import iniparser from "iniparser";
// import PropTypes from 'prop-types';

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  fileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    const reader = new FileReader();
    const scope = this;
    reader.onload = e => {
      const content = e.target.result;
      const configa = iniparser.parseString(content);
      // console.log(configa);
      scope.setState({ file: configa });
    };
    reader.readAsText(file, "UTF-8");
  }

  render() {
    return (
      <form>
        <h1>File Upload</h1>
        <input type="file" onChange={e => this.fileUpload(e.target.files[0])} />
        {/* <h1>{this.state.file.CONFIG_ENSAIO.NOS}</h1> */}
      </form>
    );
  }
}

export default UploadFile;
