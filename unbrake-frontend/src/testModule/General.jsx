import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import * as emitter from "emitter-io";
import { itensSelectionConfig } from "../configuration/Configuration";
import { itensSelection } from "../calibration/CalibrationUpload";
import { API_URL_GRAPHQL, MQTT_HOST, MQTT_PORT } from "../utils/Constants";
import Request from "../utils/Request";
import {
  changeConfigTest,
  changeCalibTest,
  changePowerTest,
  changeAvailableTest
} from "../actions/TestActions";

import { messageSistem } from "../actions/NotificationActions";
import { redirectPage } from "../actions/RedirectActions";
import { quitExperiment, submit } from "./TestFunctions";

const margin = 1.5;
const invalidId = 0;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    borderRadius: theme.spacing.unit * margin,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px"
  }
});

const renderSubmitTest = (states, dispatchs, functions) => {
  const { available, power } = states;
  const color = available ? "#2e7d32" : "#d32f2f";
  const fun = available ? submit : quitExperiment;
  console.log("FUNCAO DISPONIVEL", fun);
  return (
    <Grid container xs={4} justify="center" alignItems="center">
      <Button
        onClick={() => fun(states, functions, dispatchs)}
        color="secondary"
        variant="contained"
        name="available"
        disabled={!power}
        style={power ? { backgroundColor: color } : {}}
      >
        {power && !available ? "Cancelar Ensaio" : "Iniciar Ensaio"}
      </Button>
    </Grid>
  );
};

const allFields = (states, dispatchs, functions) => {
  const { handleChangeSelect, classes } = functions;
  return (
    <div style={{ flex: 1 }}>
      <TextField
        select
        label="Calibrações"
        value={states.calibId}
        name="calibId"
        className={classes.formControl}
        margin="normal"
        variant="outlined"
        style={{ width: "100%" }}
        onChange={handleChangeSelect}
      >
        {itensSelection(states.allCalibration)}
      </TextField>
      <TextField
        select
        label="Configurações"
        value={states.configId}
        name="configId"
        className={classes.formControl}
        margin="normal"
        variant="outlined"
        style={{ width: "100%" }}
        onChange={handleChangeSelect}
      >
        {itensSelectionConfig(states.allConfiguration)}
      </TextField>
      <Grid container item justify="center" style={{ flex: 1 }}>
        {renderSubmitTest(states, dispatchs, functions)}
      </Grid>
    </div>
  );
};

class General extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allCalibration: "",
      allConfiguration: "",
      testeId: ""
    };

    this.client = emitter.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      secure: false
    });

    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/isAvailable/" // isAvailable
    });

    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { changeAvailable, changePower } = this.props;

    const urlCalib = `${API_URL_GRAPHQL}?query=query{allCalibration{id, name, isDefault}}`;
    const method = "GET";
    Request(urlCalib, method).then(json => {
      const data = json.data.allCalibration;
      if (data !== null) {
        this.setState({ allCalibration: data });
      }
    });

    const urlConfig = `${API_URL_GRAPHQL}?query=query{configNotDefault{id, name}}`;
    Request(urlConfig, method).then(json => {
      const data = json.data.configNotDefault;
      if (data !== null) this.setState({ allConfiguration: data });
    });

    this.client.on("message", msg => {
      changePower({ power: true });
      const state = msg.asString() === "true";

      changeAvailable({ available: state });
    });
  }

  handleChange(value) {
    this.setState({ testeId: value });
    console.log("TESTE ID", value);
  }

  handleChangeSelect(event) {
    const { changeCalib, changeConfig } = this.props;
    const { name, value } = event.target;

    const id = value === invalidId ? "" : value;

    if (name === "configId") {
      changeConfig({ configId: id });
    } else if (name === "calibId") {
      changeCalib({ calibId: id });
    }
  }

  render() {
    const {
      classes,
      calibId,
      configId,
      sendMessage,
      calibration,
      configuration,
      redirect,
      changeCalib,
      changeConfig,
      available,
      power
    } = this.props;
    const { allCalibration, allConfiguration, testeId } = this.state;
    const states = {
      calibId,
      configId,
      calibration,
      configuration,
      allCalibration,
      allConfiguration,
      power,
      available,
      testeId
    };
    const dispatchs = { sendMessage, redirect, changeCalib, changeConfig };
    const functions = {
      handleChangeSelect: this.handleChangeSelect,
      handleChange: this.handleChange,
      classes
    };
    return (
      <div style={{ flex: 1 }}>{allFields(states, dispatchs, functions)}</div>
    );
  }
}

General.defaultProps = {
  calibId: "",
  configId: "",
  power: false,
  available: true,
  calibration: { values: {} },
  configuration: { values: {} }
};

General.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  configId: PropTypes.number,
  calibId: PropTypes.number,
  changeCalib: PropTypes.func.isRequired,
  changeConfig: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  calibration: PropTypes.string,
  configuration: PropTypes.string,
  redirect: PropTypes.func.isRequired,
  mqttKey: PropTypes.string.isRequired,
  power: PropTypes.bool,
  available: PropTypes.bool,
  changeAvailable: PropTypes.func.isRequired,
  changePower: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload)),
  changeCalib: payload => dispatch(changeCalibTest(payload)),
  changeConfig: payload => dispatch(changeConfigTest(payload)),
  redirect: payload => dispatch(redirectPage(payload)),
  changeAvailable: payload => dispatch(changeAvailableTest(payload)),
  changePower: payload => dispatch(changePowerTest(payload))
});

const mapStateToProps = state => {
  return {
    configId: state.testReducer.configId,
    calibId: state.testReducer.calibId,
    calibration: state.form.calibration,
    configuration: state.form.configuration,
    available: state.testReducer.available,
    power: state.testReducer.power
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(General));
