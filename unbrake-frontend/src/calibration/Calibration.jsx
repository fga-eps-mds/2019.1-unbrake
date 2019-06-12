import React from "react";
import { connect } from "react-redux";
import "../App.css";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { Button, Dialog } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import CalibrationUpload from "./CalibrationUpload";
import Vibration from "./Vibration";
import Force from "./Force";
import Temperature from "./Temperature";
import Command from "./Command";
import Speed from "./Speed";
import Relation from "./Relation";

import { messageSistem } from "../actions/NotificationActions";
import { createMutationUrl } from "../utils/Request";

const TabPadding = 24;
const borderRadius = 2.5;
const generalConfigsOption = 0;
const temperatureOption = 1;
const forceOption = 2;
const speedOption = 3;
const vibrationOption = 4;
const commandOption = 5;
const relationOption = 6;
const empty = 0;
const sizeMessageDefault = 12;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    borderTopLeftRadius: theme.spacing.unit * borderRadius,
    borderBottomLeftRadius: theme.spacing.unit * borderRadius,
    borderTopRightRadius: theme.spacing.unit * borderRadius,
    borderBottomRightRadius: theme.spacing.unit * borderRadius,
    marginTop: "8%",
    marginLeft: "10%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center"
  }
});

const variablesTemperatureOne = [
  { front: "CHT1", back: "acquisitionChanel" },
  { front: "FCT1", back: "conversionFactor" },
  { front: "OFT1", back: "temperatureOffset" }
];

const variablesTemperatureTwo = [
  { front: "CHT2", back: "acquisitionChanel" },
  { front: "FCT2", back: "conversionFactor" },
  { front: "OFT2", back: "temperatureOffset" }
];

const variablesForceOne = [
  { front: "CHF1", back: "acquisitionChanel" },
  { front: "FCF1", back: "conversionFactor" },
  { front: "OFF1", back: "forceOffset" }
];

const variablesForceTwo = [
  { front: "CHF2", back: "acquisitionChanel" },
  { front: "FCF2", back: "conversionFactor" },
  { front: "OFF2", back: "forceOffset" }
];

const variablesSpeed = [
  { front: "CHR1", back: "acquisitionChanel" },
  { front: "RAP", back: "tireRadius" }
];

const variablesVibration = [
  { front: "CHVB", back: "acquisitionChanel" },
  { front: "FCVB", back: "conversionFactor" },
  { front: "OFVB", back: "vibrationOffset" }
];

const variablesCommand = [
  { front: "CHVC", back: "commandChanelSpeed" },
  { front: "CUVC", back: "actualSpeed" },
  { front: "MAVC", back: "maxSpeed" },
  { front: "CHPC", back: "chanelCommandPression" },
  { front: "CUPC", back: "actualPression" },
  { front: "MAPC", back: "maxPression" }
];

const variablesRelations = [
  { front: "LST", back: "transversalSelectionWidth" },
  { front: "RAL", back: "heigthWidthRelation" },
  { front: "DIA", back: "rimDiameter" },
  { front: "RSM", back: "syncMotorRodation" },
  { front: "DPO", back: "sheaveMotorDiameter" },
  { front: "DPM", back: "sheaveMoveDiameter" }
];

const allVariablesCalib = [
  variablesTemperatureOne,
  variablesTemperatureTwo,
  variablesForceOne,
  variablesForceTwo,
  variablesSpeed,
  variablesVibration,
  variablesCommand,
  variablesRelations
];

const createAllCalibrations = [
  {
    mutation: "createTemperature",
    response: "temperature",
    variablesResponse: "id",
    name: "firstTemperature"
  },
  {
    mutation: "createTemperature",
    response: "temperature",
    variablesResponse: "id",
    name: "secondTemperature"
  },
  {
    mutation: "createForce",
    response: "force",
    variablesResponse: "id",
    name: "firstForce"
  },
  {
    mutation: "createForce",
    response: "force",
    variablesResponse: "id",
    name: "secondForce"
  },
  {
    mutation: "createSpeed",
    response: "speed",
    variablesResponse: "id",
    name: "speed"
  },
  {
    mutation: "createVibration",
    response: "vibration",
    variablesResponse: "id",
    name: "vibration"
  },
  {
    mutation: "createCommand",
    response: "command",
    variablesResponse: "id",
    name: "command"
  },
  {
    mutation: "createRelations",
    response: "relations",
    variablesResponse: "id",
    name: "relations"
  }
];

const variablesCalib = [
  { front: "name", back: "name" },
  { front: "firstTemperature", back: "idFirstTemperature" },
  { front: "secondTemperature", back: "idSecondTemperature" },
  { front: "firstForce", back: "idFirstForce" },
  { front: "secondForce", back: "idSecondForce" },
  { front: "speed", back: "idSpeed" },
  { front: "vibration", back: "idVibration" },
  { front: "command", back: "idCommand" },
  { front: "relations", back: "idRelations" }
];

const createCalibration = {
  mutation: "createCalibration",
  response: "calibration",
  variablesResponse: "id"
};

const validadeFields = (calibration, sendMessage) => {
  let message = allVariablesCalib.reduce((prevMessage, newDictionary) => {
    const newMessage = newDictionary.reduce((prevMessageTwo, newField) => {
      if (
        calibration[newField.front] === undefined ||
        calibration[newField.front].length === empty
      ) {
        if (prevMessageTwo.length === sizeMessageDefault)
          return `${prevMessageTwo} ${newField.front}`;
        return `${prevMessageTwo}, ${newField.front}`;
      }
      return prevMessageTwo;
    }, prevMessage);

    return newMessage;
  }, "O(s) campos ");

  if (message.length > sizeMessageDefault) {
    message += " está(ão) vazios";
    sendMessage({
      message,
      variante: "error",
      condition: true
    });
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
    // handleChangeId(value.name, id);
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

  await createMutationUrl(createCalibration, variablesCalib, idsCalibration);
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
  <div className="App">
    <div style={{ marginTop: "6%", marginBottom: "2%" }}>
      <CalibrationUpload />
    </div>

    <div style={{ justifyContent: "center", display: "flex" }} />
  </div>
);

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: TabPadding }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
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

    saveCalibration(values, sendMessage, this.handleChangeId);
  }

  render() {
    const { classes } = this.props;
    const { value, name, open } = this.state;
    const states = { name, open };
    const functions = {
      handleClose: this.handleClose,
      handleChangeStates: this.handleChangeStates,
      handleSubmit: this.handleSubmit
    };

    return (
      <div>
        <div className={classes.root}>
          <AppBar
            color="inherit"
            className={classes.appBar}
            position="relative"
          >
            <Tabs centered value={value} onChange={this.handleChange}>
              <Tab label="Gerais" />
              <Tab label="Temperatura" />
              <Tab label="Força" />
              <Tab label="Velocidade" />
              <Tab label="Vibração" />
              <Tab label="Comando" />
              <Tab label="Relações" />
            </Tabs>
            <Button onClick={this.handleValidate}>Cadastrar</Button>
          </AppBar>
          {value === generalConfigsOption && GeneralConfigs()}
          {value === temperatureOption && <Temperature />}
          {value === forceOption && <Force />}
          {value === speedOption && <Speed />}
          {value === vibrationOption && <Vibration />}
          {value === commandOption && <Command />}
          {value === relationOption && <Relation />}
        </div>
        {dialogName(functions, states)}
      </div>
    );
  }
}

Calibration.propTypes = {
  sendMessage: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    calibration: state.form.calibration
  };
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Calibration));
