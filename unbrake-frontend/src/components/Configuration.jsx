import React from "react";
import iniparser from "iniparser";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ConfigurationForm from "./ConfigurationForm";

const styles = () => ({
  title: {
    padding: "5px"
  },
  grid: {
    padding: "5px"
  }
});

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
          TAO: Boolean,
          TAS: "",
          TAT: "",
          TBS: "",
          TMO: Boolean,
          USL: "",
          UWT: ""
        }
      }
    };

    this.fileUpload = this.fileUpload.bind(this);
  }

  uploadField(field) {
    const { classes } = this.props;

    let archive;

    if (field === "calibration") archive = "Calibração";
    else archive = "Configuração";

    return (
      <Grid container item xs={10} alignItems="center" justify="center">
        <Grid item xs={4} className={classes.title}>
          <h2 justify="left">Upload arquivo de {archive}</h2>
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <Input
            type="file"
            name={field}
            onChange={e => this.fileUpload(e.target.files[0], field)}
          />
        </Grid>
      </Grid>
    );
  }

  fileUpload(file, name) {
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
        spacing={12}
      >
        <form>
          {this.uploadField("calibration")}
          {this.uploadField("configuration")}
          <ConfigurationForm configuration={configuration} />
        </form>
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Configuration);
