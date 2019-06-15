import React from "react";
import iniparser from "iniparser";
import Paper from "@material-ui/core/Paper";
import { Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { connect } from "react-redux";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import ConfigurationForm from "./ConfigurationForm";
import styles from "./Styles";
import {
  createConfig,
  submitDefault,
  query,
  submit,
  dialogName
} from "./ConfigFunctions";
import NotificationContainer from "../components/Notification";
import { messageSistem } from "../actions/NotificationActions";
import { redirectPage } from "../actions/RedirectActions";

const positionVector = 1;

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
      <TextField
        id="outlined-select-currency"
        select
        label="Configurações"
        value={configStates[0]}
        onChange={handleChange}
        name="dataBaseConfiguration"
        className={classes.formControl}
        margin="normal"
        variant="outlined"
      >
        {itensSelection(configStates[1])}
      </TextField>
    </Grid>
  );
};

const defaultButton = handleUpDefault => {
  return (
    <Button onClick={handleUpDefault} color="secondary" variant="contained">
      Configuração Padrão
    </Button>
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
          TAO: false,
          TAS: "",
          TAT: "",
          TBS: "",
          TMO: false,
          USL: "",
          UWT: ""
        },
        name: ""
      },
      isDefault: false,
      fileName: "Upload do arquivo de configuração",
      dataBaseConfiguration: 0,
      allConfiguration: "",
      open: false
    };

    this.handleUpDefault = this.handleUpDefault.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIsDefault = this.handleIsDefault.bind(this);
  }

  componentDidMount() {
    const url = `${API_URL_GRAPHQL}?query=query{configNotDefault{id, name}}`;
    const method = "GET";
    Request(url, method).then(json => {
      const data = json.data.configNotDefault;
      this.setState({ allConfiguration: data });
    });
  }

  handleClickSave(state) {
    const CONFIG_ENSAIO = state.configuration;
    const newConfig = { CONFIG_ENSAIO };
    this.setState({ configuration: newConfig });
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleIsDefault(event) {
    this.setState({ isDefault: event.target.checked });
  }

  handleSubmit() {
    const { configuration, name, isDefault } = this.state;
    const { sendMessage, redirect } = this.props;

    if (isDefault) {
      if (submitDefault(configuration.CONFIG_ENSAIO, name, sendMessage))
        redirect({ url: "/calibration" });
    } else if (submit(configuration.CONFIG_ENSAIO, name, sendMessage)) {
      redirect({ url: "/calibration" });
    }
  }

  handleUpDefault() {
    const url = `${API_URL_GRAPHQL}?query=query{configDefault{${query}}}`;

    const method = "GET";

    const empty = 0;

    Request(url, method).then(response => {
      if (response.data.configDefault.length === empty) {
        return;
      }
      const position = response.data.configDefault.length - positionVector;
      const data = response.data.configDefault[position];
      const configurationDefault = createConfig(data);
      this.setState({ configuration: configurationDefault });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    const invalidId = 0;
    if (
      event.target.name === "dataBaseConfiguration" &&
      event.target.value > invalidId
    )
      this.handleSelectConfig(event.target.value);
  }

  handleSelectConfig(id) {
    const url = `${API_URL_GRAPHQL}?query=query{configAt(id:${id}){${query}}}`;

    const method = "GET";

    Request(url, method).then(response => {
      const data = response.data.configAt;

      const configurationDefault = createConfig(data);
      this.setState({ configuration: configurationDefault });
    });
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
          <h2>Upload arquivo de {archive}</h2>
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
              <span
                className={classes.input_file_name}
                placeholder="Upload do arquivo de configuração"
              >
                {fileName}
              </span>
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
      scope.setState({ configuration: fileUpload });
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { classes } = this.props;
    const {
      configuration,
      dataBaseConfiguration,
      allConfiguration,
      open,
      name,
      isDefault
    } = this.state;
    const functions = {
      handleChange: this.handleChange,
      handleClose: this.handleClose,
      handleSubmit: this.handleSubmit,
      handleIsDefault: this.handleIsDefault
    };
    const configStates = [dataBaseConfiguration, allConfiguration];
    const dialogStates = {
      configuration: configuration.CONFIG_ENSAIO,
      open,
      name,
      isDefault
    };

    return (
      <Grid alignItems="center" container className={classes.configuration}>
        <div>
          <Grid container item justify="center">
            {this.uploadField("configuration")}
          </Grid>
          <Grid container justify="center" item alignItems="center" xs={12}>
            {selectConfiguration(this.handleChange, configStates, classes)}
            {defaultButton(this.handleUpDefault)}
          </Grid>
          <Grid container xs={12} item className={classes.form}>
            <ConfigurationForm
              configuration={configuration}
              handleClickSave={this.handleClickSave}
            />
          </Grid>
        </div>
        {dialogName(functions, dialogStates)}
        <NotificationContainer />
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  sendMessage: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload)),
  redirect: payload => dispatch(redirectPage(payload))
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Configuration));
