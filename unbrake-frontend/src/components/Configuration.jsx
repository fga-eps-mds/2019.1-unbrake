import React from "react";
import { FileUpload } from "redux-file-upload";
import { reduxForm } from "redux-form";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

const UploadFile = props => {
  const { handleSubmit } = props;

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <FileUpload
            allowedFileTypes={["doc", "pdf"]}
            data={{ type: "picturefile" }}
            dropzoneId="fileUpload"
          >
            <button>Upload</button>
          </FileUpload>
        </form>
      </header>
    </div>
  );
  // }
};

export default reduxForm({
  form: "login"
})(UploadFile);
