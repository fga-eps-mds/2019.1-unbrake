import React from "react";
import iniparser from "iniparser";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
// import ConfigurationForm from "./ConfigurationForm";

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.onChange = this.onChange.bind(this);
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
      }
      if (name === "calibration") {
        // alert("Calibracao");
        scope.setState({ calibration: fileUpload });
      }
      // console.log(this.state.calibration);
    };
    // console.log(obj.config.CONFIG_ENSAIO.NOS);

    reader.readAsText(file, "UTF-8");
  }

  render() {
    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        container
        spacing={12}
      >
        <form>
          <h1>Upload File</h1>
          <Grid container item xs={24} alignItems="center" justify="center">
            <Input
              type="file"
              name="configuration"
              onChange={e =>
                this.fileUpload(e.target.files[0], "configuration")
              }
            />
            <Input
              type="file"
              onChange={e => this.fileUpload(e.target.files[0], "calibration")}
            />
          </Grid>

          {/* <h1>{this.state.configuration.CONFIG_ENSAIO.NOS}</h1>
          <h1>{this.state.calibration.CONFIG_ENSAIO.TBS}</h1> */}
          {/* <ConfigurationForm/>  */}
        </form>
      </Grid>
    );
  }
}

export default Configuration;
