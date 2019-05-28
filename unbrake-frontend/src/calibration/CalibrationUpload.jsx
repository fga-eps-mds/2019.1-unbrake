import React from "react";
import iniparser from "iniparser";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MyForm from "./CalibrationTempForm";
import { initialize, Field, reduxForm } from "redux-form";
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
    flex: 1,
  },


input: {
    display: "none"
  },


rootUploadFile: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  },
});

class CalibrationUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = this.fileUpload.bind(this);
    this.state = {
      calibration: {
        CALIBRA_TEMPERATURA: {
          CHT1: "",
          FCT1: "",
          OFT1: "",
          CHT2: "",
          FCT2: "",
          OFT2: ""
        },

        CALIBRA_FORCA: {
          CHF1: "",
          FCF1: "",
          OFF1: "",
          CHF2: "",
          FCF2: "",
          OFF2: ""
        },

        CALIBRA_VELOCIDADE: {
          CHR1: "",
          RAP: ""
        },

        CALIBRA_COMANDO: {
          CHVC: "",
          CUVC: "",
          MAVC: "",
          CHPC: "",
          CUPC: "",
          MAPC: ""
        },

        CALIBRA_RELACOES: {
          LST: "",
          RAL: "",
          DIA: "",
          RSM: "",
          DPO: "",
          DPM: ""
        }
      }
    };
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
    const {  filename, addFileName } = this.props;
    addFileName(file.name);
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const scope = this;
    const bla = this.props.dispatch;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);

      if (name === "calibration") {
        console.log('----------------------')
        console.log(fileUpload)
        const f = {...fileUpload.CALIBRA_TEMPERATURA, ...fileUpload.CALIBRA_VIBRACAO}
        bla(initialize("calibration", f));

        console.log(scope.props, "calib")
        scope.setState({ calibration: fileUpload });
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { calibration } = this.state;
    const { filename } = this.props;
    let file = filename
      ? ( <span>{filename}</span>)
      : ( <span>Escolha um arquivo...</span> );

    console.log("up", this.state);
    return (
      <Grid
        alignItems="center"
        justify="center"
        // style={{ minHeight: "100vh" }}
        container
        // spacing={40}
      >
        {this.uploadField("calibration", filename)}
      </Grid>
    );
  }
}

CalibrationUpload.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const mapDispatchToProps = dispatch => ({
  addFileName: value => dispatch(addFile(value))
});

const mapStateToProps = state => ({
  filename: state.fileReducer.filename
});

const Upload = reduxForm({
  form: "calibration",
  destroyOnUnmount: false,
})(CalibrationUpload);


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Upload));
