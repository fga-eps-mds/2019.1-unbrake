import React from "react";
import iniparser from "iniparser";
import {
  DialogTitle,
  Grid,
  Button,
  Dialog,
  MenuItem,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import ConfigurationForm from "./ConfigurationForm";
import styles from "./Styles";
import {
  createConfig,
  query,
  submit,
  renderUploadField
} from "./ConfigFunctions";
import NotificationContainer from "../components/Notification";
import { messageSistem } from "../actions/NotificationActions";
import { changeConfigTest } from "../actions/TestActions";

export const itensSelectionConfig = allConfiguration => {
  let allConfig = [{ id: 0, name: "" }];
  if (allConfiguration !== "" && allConfiguration !== undefined) {
    allConfig = allConfig.concat(allConfiguration);
  }
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
        {itensSelectionConfig(configStates[1])}
      </TextField>
    </Grid>
  );
};

const dialogName = (functions, sendMessage, dialogStates) => {
  return (
    <Dialog
      open={dialogStates.open}
      onClose={functions.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Nome da Configuração</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Insira aqui o nome que você deseja dar para este arquivo de
          configuração
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          onChange={functions.handleChange}
          value={dialogStates.name}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={functions.handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={() =>
            submit(dialogStates.configuration, dialogStates.name, sendMessage)
          }
          color="primary"
        >
          Cadastrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const defaultButton = handleUpDefault => {
  return (
    <Button onClick={handleUpDefault} color="secondary" variant="contained">
      Configuração Padrão
    </Button>
  );
};

const changeReduxConfig = (allConfiguration, dataBaseConfiguration) => {
  const backIndex = 1;
  if (
    allConfiguration[dataBaseConfiguration - backIndex] !== null &&
    allConfiguration[dataBaseConfiguration - backIndex] !== undefined
  )
    changeConfigTest({
      configId: allConfiguration[dataBaseConfiguration - backIndex].id,
      configName: allConfiguration[dataBaseConfiguration - backIndex].name
    });
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
      fileName: "Upload do arquivo de configuração",
      dataBaseConfiguration: 0,
      allConfiguration: "",
      open: false
    };

    this.handleUpDefault = this.handleUpDefault.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  componentDidMount() {
    const url = `${API_URL_GRAPHQL}?query=query{configNotDefault{id, name}}`;
    const method = "GET";
    Request(url, method).then(json => {
      const data = json.data.configNotDefault;
      if (data !== null) this.setState({ allConfiguration: data });
    });
  }

  handleClickSave(state) {
    const CONFIG_ENSAIO = state.configuration;
    const newConfig = { CONFIG_ENSAIO };
    this.setState({ configuration: newConfig });
    this.handleClickOpen();
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleUpDefault() {
    const url = `${API_URL_GRAPHQL}?query=query{configDefault{${query}}}`;

    const method = "GET";

    const VAZIO = 0;

    Request(url, method).then(response => {
      if (response.data.configDefault.length === VAZIO) {
        return;
      }
      const data = response.data.configDefault[0];
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

  fileUpload(file, name) {
    const { sendMessage } = this.props;
    this.setState({ fileName: file.name });
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const scope = this;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);
      if (fileUpload.CONFIG_ENSAIO !== undefined)
        scope.setState({ configuration: fileUpload });
      else {
        sendMessage({
          message: "Aquivo não se encontra no padrão .ini para configuração",
          variante: "warning",
          condition: true
        });
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  uploadField(field) {
    const { classes } = this.props;
    const { fileName } = this.state;
    let archive;

    if (field === "calibration") archive = "Calibração";
    else archive = "Configuração";
    const names = { field, fileName, archive };
    return <div>{renderUploadField(classes, this.fileUpload, names)}</div>;
  }

  render() {
    const { classes, sendMessage } = this.props;
    const {
      configuration,
      dataBaseConfiguration,
      allConfiguration,
      open,
      name
    } = this.state;
    const functions = {
      handleChange: this.handleChange,
      handleClose: this.handleClose
    };
    const configStates = [dataBaseConfiguration, allConfiguration];
    const dialogStates = {
      configuration: configuration.CONFIG_ENSAIO,
      open,
      name
    };
    changeReduxConfig(allConfiguration, dataBaseConfiguration);
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
          <Grid
            container
            alignItems="center"
            xs={12}
            item
            className={classes.form}
          >
            <ConfigurationForm
              configuration={configuration}
              handleClickSave={this.handleClickSave}
            />
          </Grid>
        </div>
        {dialogName(functions, sendMessage, dialogStates)}
        <NotificationContainer />
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  sendMessage: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload)),
  changeConfigTest: payload => dispatch(changeConfigTest(payload))
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Configuration));
