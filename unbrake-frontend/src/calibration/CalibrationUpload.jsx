import React from "react";
import iniparser from "iniparser";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { initialize, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { addFile } from "../actions/FileActions";

const styles = () => ({
  title: {
    padding: "5px"
  },
  grid: {
    padding: "5px"
  },

  input_file_name: {
    marginLeft: 8,
    flex: 1
  },

  input: {
    display: "none"
  },

  rootUploadFile: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  }
});

class CalibrationUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = this.fileUpload.bind(this);
  }

  uploadField(field, filename) {
    const { classes } = this.props;

    let archive;

    if (field === "calibration") archive = "Calibração";

    return (
      <Grid container item xs={10} alignItems="center" justify="center">
        <Grid item xs={4} className={classes.title}>
          <h2 justify="left">Upload arquivo de {archive}</h2>
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <label htmlFor="contained-button-file">
            <input
              id="contained-button-file"
              type="file"
              name={field}
              className={classes.input}
              onChange={e => this.fileUpload(e.target.files[0], field)}
            />
            <Paper className={classes.rootUploadFile}>
              <IconButton component="span">
                <CloudUploadIcon style={{ color: "black" }} />
              </IconButton>
              <span>{filename}</span>
            </Paper>
          </label>
        </Grid>
      </Grid>
    );
  }

  fileUpload(file, name) {
    const { addFileName } = this.props;
    addFileName(file.name);
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const { dispatch } = this.props;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);

      if (name === "calibration") {
        const calibration = {
          ...fileUpload.CALIBRA_TEMPERATURA,
          ...fileUpload.CALIBRA_VIBRACAO,
          ...fileUpload.CALIBRA_FORCA,
          ...fileUpload.CALIBRA_VELOCIDADE,
          ...fileUpload.CALIBRA_COMANDO,
          ...fileUpload.CALIBRA_RELACOES
        };
        dispatch(initialize("calibration", calibration));
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { filename } = this.props;

    return (
      <Grid alignItems="center" justify="center" container>
        {this.uploadField("calibration", filename)}
      </Grid>
    );
  }
}

CalibrationUpload.defaultProps = {
  filename: ""
};

CalibrationUpload.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  addFileName: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  filename: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  addFileName: value => dispatch(addFile(value))
});

const mapStateToProps = state => ({
  filename: state.fileReducer.filename
});

const Upload = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(CalibrationUpload);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Upload));
