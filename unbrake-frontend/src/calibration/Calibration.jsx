import React from "react";
import { connect } from "react-redux";
import "../App.css";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import CalibrationUpload from "./CalibrationUpload";
import Vibration from "./Vibration";
import Force from "./Force";
import Temperature from "./Temperature";
import Command from "./Command";
import Speed from "./Speed";

import { messageSistem } from "../actions/NotificationActions";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

const TabPadding = 24;
const borderRadius = 2.5;
const generalConfigsOption = 0;
const temperatureOption = 1;
const forceOption = 2;
const speedOption = 3;
const vibrationOption = 4;
const commandOption = 5;
const empty = 0;
const sizeMessageDefault = 12;

const allVariablesCalib = [
  "CHT1",
  "FCT1",
  "OFT1",
  "CHT2",
  "FCT2",
  "OFT2",
  "CHF1",
  "FCF1",
  "OFF1",
  "CHF2",
  "FCF2",
  "OFF2",
  "CHR1",
  "RAP",
  "CHVB",
  "FCVB",
  "OFVB",
  "CHVC",
  "CUVC",
  "MAVC",
  "CUPC",
  "MAPC"
];

const validadeFields = (calibration, sendMessage) => {
  let message = allVariablesCalib.reduce((prevMessage, newField) => {
    if (
      calibration[newField] === undefined ||
      calibration[newField].length === empty
    ) {
      if (prevMessage.length === sizeMessageDefault)
        return `${prevMessage} ${newField}`;
      return `${prevMessage}, ${newField}`;
    }
    return prevMessage;
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

const saveCalibration = async (calibration, sendMessage) => {
  const validate = validadeFields(calibration, sendMessage);
  if (validate === false) return;

  const url = allVariablesCalib.reduce((prevMessage, newField) => {
    return `${prevMessage},${newField}:${calibration[newField]}`;
  }, `${API_URL_GRAPHQL}?query=mutation{createCalibra(name:"teste"`);

  const response = await Request(url, "POST");
  if (response.errors === undefined) {
    sendMessage({
      message: "Arquivo cadastrado com sucesso",
      variante: "success",
      condition: true
    });
  }
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

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  handleSubmit() {
    const { calibration } = this.props;
    const calibrationValues = calibration.values;
    const { sendMessage } = this.props;
    saveCalibration(calibrationValues, sendMessage);
    /*
     * Se estiver correto, submete a calibração e exibe a notificação verde
     * Case contrário, mostra a notificação mostrando os campos que estão
     * vazios
     */
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

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
            </Tabs>
            <Button onClick={this.handleSubmit}>Cadastrar</Button>
          </AppBar>
          {value === generalConfigsOption && GeneralConfigs()}
          {value === temperatureOption && <Temperature />}
          {value === forceOption && <Force />}
          {value === speedOption && <Speed />}
          {value === vibrationOption && <Vibration />}
          {value === commandOption && <Command />}
        </div>
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
