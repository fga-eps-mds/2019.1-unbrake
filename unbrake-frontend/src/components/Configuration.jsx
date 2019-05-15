import React from "react";
import iniparser from "iniparser";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ConfigurationForm from "./ConfigurationForm";

const styles = () => ({
  title: {
    padding: "5px"
  },
  grid: {
    padding: "5px"
  },
  formControl: {
    minWidth: 200
  }
});

const selectConfiguration = (handleChange, dataBaseConfiguration, classes) => {
  return (
    <Grid item xs={4} className={classes.title}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-simple">Configurações</InputLabel>
        <Select
          value={dataBaseConfiguration}
          onChange={handleChange}
          input={
            <OutlinedInput
              labelWidth={dataBaseConfiguration}
              name="dataBaseConfiguration"
              id="outlined-age-simple"
            />
          }
        >
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>Configuration 1</MenuItem>
          <MenuItem value={2}>Configuration 2</MenuItem>
          <MenuItem value={3}>Configuration 3</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

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
      dataBaseConfiguration: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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
    const { configuration, dataBaseConfiguration } = this.state;
    const { classes } = this.props;

    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "5px" }}
        container
        spacing={40}
      >
        {this.uploadField("configuration")}
        {selectConfiguration(this.handleChange, dataBaseConfiguration, classes)}
        <ConfigurationForm configuration={configuration} />
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Configuration);
