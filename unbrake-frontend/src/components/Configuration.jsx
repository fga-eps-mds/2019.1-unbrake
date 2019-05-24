import React from "react";
import iniparser from "iniparser";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import styles from "./Styles";
import ConfigurationForm from "./ConfigurationForm";

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration: {
        CONFIG_ENSAIO: {
          LSL: "",
          LWT: "",
          NOS: "",
          PTD: "",
          TAO: false,
          TAS: "",
          TAT: "",
          TBS: "",
          TMO: false,
          USL: "",
          UWT: ""
        }
      },
      fileName: ""
    };

    this.fileUpload = this.fileUpload.bind(this);
  }

  uploadField(field) {
    const { classes } = this.props;
    const { fileName } = this.state;

    let archive;

    if (field === "calibration") archive = "Calibração";
    else archive = "Configuração";

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
              <InputBase
                disabled
                className={classes.input_file_name}
                value={fileName}
                placeholder="Upload do arquivo de configuração"
              />
            </Paper>
          </label>
        </Grid>
      </Grid>
    );
  }

  fileUpload(file, name) {
    this.setState({ fileName: file.name });
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const scope = this;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);
      if (name === "configuration") {
        scope.setState({ configuration: fileUpload });
        scope.setState({ configuration: fileUpload });
      }
      if (name === "calibration") {
        scope.setState({ calibration: fileUpload });
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { configuration } = this.state;

    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        container
        spacing={40}
      >
        {this.uploadField("calibration")}
        {this.uploadField("configuration")}
        <ConfigurationForm configuration={configuration} />
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Configuration);
