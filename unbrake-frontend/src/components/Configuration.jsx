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
      // calibration: {}
    };

    this.fileUpload = this.fileUpload.bind(this);
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
        // alert("Configuracao");
        scope.setState({ configuration: fileUpload });
        scope.setState({ configuration: fileUpload });
      }
      if (name === "calibration") {
        // alert("Calibracao");
        scope.setState({ calibration: fileUpload });
      }
      // console.log(this.state.calibration);
    };

    reader.readAsText(file, "UTF-8");
    // console.log(this.state.configuration.CONFIG_ENSAIO.NOS);
  }

  render() {
    const { configuration } = this.state;
    const { classes } = this.props;

    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        container
        spacing={12}
      >
        <form>
          <Grid container item xs={10} alignItems="center" justify="center">
            <Grid item xs={4} className={classes.title}>
              <h2 justify="left">Upload arquivo de Calibração</h2>
            </Grid>
            <Grid item xs={4} className={classes.grid}>
              <Input
                type="file"
                name="configuration"
                onChange={e =>
                  this.fileUpload(e.target.files[0], "calibration")
                }
              />
            </Grid>
          </Grid>
          <Grid container item xs={10} alignItems="center" justify="center">
            <Grid item xs={4} className={classes.title}>
              <h2>Upload arquivo de Configuração</h2>
            </Grid>
            <Grid item xs={4} className={classes.grid}>
              <Input
                type="file"
                name="configuration"
                onChange={e =>
                  this.fileUpload(e.target.files[0], "configuration")
                }
              />
            </Grid>
          </Grid>

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
