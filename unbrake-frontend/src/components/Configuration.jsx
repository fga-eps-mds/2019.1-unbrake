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
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

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

const itensSelection = allConfiguration => {
  let allConfig = [{ id: 0, name: "" }];
  allConfig = allConfig.concat(allConfiguration);

  const itens = allConfig.map(value => {
    return (
      <MenuItem key={value.name + value.id} value={value.id}>
        {value.name}
      </MenuItem>
    );
  });
  return itens;
};

const selectConfiguration = (handleChange, configStates, classes) => {
  return (
    <Grid item xs={4} className={classes.title}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-simple">Configurações</InputLabel>
        <Select
          value={configStates[0]}
          onChange={handleChange}
          input={
            <OutlinedInput
              labelWidth={configStates[0]}
              name="dataBaseConfiguration"
              id="outlined-age-simple"
            />
          }
        >
          {itensSelection(configStates[1])}
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
      dataBaseConfiguration: 0,
      allConfiguration: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  componentDidMount() {
    const url = `${API_URL_GRAPHQL}?query=query{allConfig{id, name}}`;
    const method = "POST";
    Request(url, method).then(json => {
      const { data } = json.data;
      const { allConfig } = data.allConfig;
      this.setState({ allConfiguration: allConfig });
    });
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
      scope.setState({ configuration: fileUpload });
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { classes } = this.props;
    const {
      configuration,
      dataBaseConfiguration,
      allConfiguration
    } = this.state;
    const configStates = [dataBaseConfiguration, allConfiguration];

    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "5px" }}
        container
        spacing={40}
      >
        {this.uploadField("configuration")}

        {selectConfiguration(this.handleChange, configStates, classes)}
        <ConfigurationForm configuration={configuration} />
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Configuration);
