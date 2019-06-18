import React from "react";
import { connect } from "react-redux";
import "../App.css";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { Button, Dialog } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import CalibrationUpload from "./CalibrationUpload";
import Vibration from "./Vibration";
import Force from "./Force";
import Temperature from "./Temperature";
import Command from "./Command";
import Speed from "./Speed";
import Relation from "./Relation";
import { messageSistem } from "../actions/NotificationActions";
import { createMutationUrl } from "../utils/Request";
import {
  allVariablesCalib,
  createAllCalibrations,
  variablesCalib,
  createCalibration,
  empty,
  labels
} from "./CalibrationVariables";

const borderRadius = 1.5;
const generalConfigsOption = 0;
const temperatureOption = 1;
const forceOption = 2;
const speedOption = 3;
const vibrationOption = 4;
const commandOption = 5;
const relationOption = 6;
const sizeMessageDefault = 14;
const invalidID = -1;
let createMessage = "";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    marginTop: "90px"
  },
  appBar: {
    borderRadius: theme.spacing.unit * borderRadius
  }
});

const sendMessageFunction = (sendMessage, message, variante) => {
  sendMessage({
    message,
    variante,
    condition: true
  });
};

const validadeFields = (calibration, sendMessage) => {
  createMessage = allVariablesCalib.reduce((prevMessage, newDictionary) => {
    const newMessage = newDictionary.reduce((prevMessageTwo, newField) => {
      if (
        calibration[newField.front] === undefined ||
        calibration[newField.front].length === empty
      ) {
        if (prevMessageTwo.length === sizeMessageDefault)
          return `${prevMessageTwo} "${labels(newField.front)}"`;
        return `${prevMessageTwo}, "${labels(newField.front)}"`;
      }
      return prevMessageTwo;
    }, prevMessage);

    return newMessage;
  }, "O(s) campo(s) ");

  if (createMessage.length > sizeMessageDefault) {
    createMessage += " está(ão) vazios";
    sendMessageFunction(sendMessage, createMessage, "error");
    return false;
  }
  return true;
};

const firstRequests = async values => {
  const calibrationParts = createAllCalibrations.map(async (value, number) => {
    const id = await createMutationUrl(
      value,
      allVariablesCalib[number],
      values.calibration
    );
    return { name: [value.name], id };
  });
  let calibration = await Promise.all(calibrationParts);
  calibration = calibration.reduce((initial, actual) => {
    initial[actual.name] = actual.id; // eslint-disable-line no-param-reassign
    return initial;
  }, {});

  return calibration;
};

const saveCalibration = async (values, sendMessage, handleChangeId) => {
  const validate = validadeFields(values.calibration, sendMessage);
  if (validate === false) return;

  const idsCalibration = await firstRequests(values, handleChangeId);
  idsCalibration.name = values.name;

  const responseSaved = await createMutationUrl(
    createCalibration,
    variablesCalib,
    idsCalibration
  );

  if (responseSaved === invalidID) {
    createMessage = "Falha no cadastro da calibração";
    sendMessageFunction(sendMessage, createMessage, "error");
  } else {
    createMessage = "Calibração cadastrada com sucesso";
    sendMessageFunction(sendMessage, createMessage, "success");
  }
};

const dialogName = (functions, states) => {
  return (
    <Dialog
      open={states.open}
      onClose={functions.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Nome da Calibração</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Insira aqui o nome que você deseja dar para este arquivo de Calibração
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          onChange={functions.handleChangeStates}
          value={states.name}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={functions.handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => functions.handleSubmit()} color="primary">
          Cadastrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GeneralConfigs = () => (
  <div>
    <div style={{ marginTop: "6%", marginBottom: "2%" }}>
      <CalibrationUpload />
    </div>
  </div>
);

const appBar = (functions, classes, value) => {
  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" className={classes.appBar}>
        <Tabs
          value={value}
          onChange={functions.handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Gerais" />
          <Tab label="Temperatura" />
          <Tab label="Força" />
          <Tab label="Velocidade" />
          <Tab label="Vibração" />
          <Tab label="Comando" />
          <Tab label="Relações" />
        </Tabs>
      </AppBar>
      <Grid
        item
        xs={12}
        container
        justify="center"
        style={{ marginTop: "15px" }}
      >
        <Button
          color="secondary"
          variant="contained"
          onClick={functions.handleValidate}
        >
          Cadastrar
        </Button>
      </Grid>
      {value === generalConfigsOption && GeneralConfigs()}
      {value === temperatureOption && <Temperature />}
      {value === forceOption && <Force />}
      {value === speedOption && <Speed />}
      {value === vibrationOption && <Vibration />}
      {value === commandOption && <Command />}
      {value === relationOption && <Relation />}
    </div>
  );
};

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 0,
      name: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeStates = this.handleChangeStates.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  handleChangeStates(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeId(name, value) {
    const idsCalibrations = { [name]: value };

    this.setState(prevState => ({
      idsCalibrations: { ...prevState.idsCalibrations, ...idsCalibrations }
    }));
  }

  handleValidate() {
    const { calibration, sendMessage } = this.props;

    const validate = validadeFields(calibration.values, sendMessage);
    if (validate === false) return;

    this.setState({ open: true });
  }

  handleSubmit() {
    const { calibration, sendMessage } = this.props;
    const { name } = this.state;
    const values = { calibration: calibration.values, name };

    this.setState({ open: false });

    saveCalibration(values, sendMessage, this.handleChangeId);
  }

  render() {
    const { classes } = this.props;
    const { value, name, open } = this.state;
    const states = { name, open };
    const functions = {
      handleClose: this.handleClose,
      handleChangeStates: this.handleChangeStates,
      handleSubmit: this.handleSubmit,
      handleChange: this.handleChange,
      handleValidate: this.handleValidate
    };

    return (
      <Grid item container xs={12} justify="center" alignItems="center">
        <Grid item container xs={11} justify="center" alignItems="center">
          {appBar(functions, classes, value)}
        </Grid>
        {dialogName(functions, states)}
      </Grid>
    );
  }
}

Calibration.propTypes = {
  sendMessage: PropTypes.func.isRequired
};

Calibration.defaultProps = {
  calibration: { values: {} }
};

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload))
});

Calibration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  calibration: PropTypes.objectOf(PropTypes.string)
};

export default connect(mapDispatchToProps)(withStyles(styles)(Calibration));
