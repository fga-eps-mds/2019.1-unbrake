import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { itensSelectionConfig } from "../configuration/Configuration";
import { itensSelection } from "../calibration/CalibrationUpload";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";
import { changeConfigTest, changeCalibTest } from "../actions/TestActions";
import { validateFields, saveCalibration } from "../calibration/Calibration";
import { createCalibration } from "../calibration/CalibrationVariables";
import { messageSistem } from "../actions/NotificationActions";
import { redirectPage } from "../actions/RedirectActions";
import { saveConfiguration } from "../configuration/ConfigFunctions";

const margin = 1.5;
const invalidId = 0;
const empty = 0;
const sizeMessageDefault = 14;

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

const configFields = [
  { front: "NOS", label: "Numero de Snubs" },
  { front: "USL", label: "Limite Superior (km/h)" },
  { front: "UWT", label: "Tempo de Espera (s)" },
  { front: "LSL", label: "Limite inferior (km/h)" },
  { front: "LWT", label: "Tempo de espera (s)" },
  { front: "TBS", label: "Tempo entre ciclos" },
  { front: "TAS", label: "Temperatura(˚C)(AUX1)" },
  { front: "TAT", label: "Tempo (s)(AUX1)" }
];

const validateConfig = (configuration, sendMessage) => {
  let createMessage = configFields.reduce((prevMessage, newField) => {
    if (
      configuration[newField.front] === undefined ||
      configuration[newField.front].length === empty
    ) {
      if (prevMessage.length === sizeMessageDefault)
        return `${prevMessage} "${newField.label}"`;
      return `${prevMessage}, "${newField.label}"`;
    }
    return prevMessage;
  }, "O(s) campo(s) ");

  if (createMessage.length > sizeMessageDefault) {
    createMessage += " está(ão) vazios";
    sendMessage({
      message: createMessage,
      variante: "error",
      condition: true
    });
    return false;
  }
  return true;
};

const submit = (states, dispatchs) => {
  const values = {
    calibration: states.calibration.values,
    name: "",
    createCalibration
  };

  if (states.calibId === "") {
    if (!validateFields(states.calibration.values, dispatchs.sendMessage))
      return;
    saveCalibration(values, dispatchs);
  }

  if (states.configId === "") {
    if (!validateConfig(states.configuration.values, dispatchs.sendMessage))
      return;
    saveConfiguration(states.configuration.values, "", dispatchs);
  }

  const urlUser = `${API_URL_GRAPHQL}?query=query{currentUser{username}}`;
  if (states.configId !== "" && states.calibId !== "") {
    Request(urlUser, "GET").then(username => {
      const urlTesting = `${API_URL_GRAPHQL}?query=mutation{createTesting(createBy:"${username}",
        idCalibration:${states.calibId},idConfiguration:${
        states.configId
      }){testing{id},error}}`;

      Request(urlTesting, "POST").then(response => {
        const { createTesting } = response.data;
        const { id } = createTesting.testing;
        const urlSubmit = `${API_URL_GRAPHQL}?query=mutation{submitTesting(mqttHost:"unbrake.ml",mqttPort:8080,testingId:${id}){succes}}`;
        Request(urlSubmit, "POST").then(() => {
          // Faz todos os processos do ensaio
        });
      });
    });
  }
};

const renderSubmitTest = (states, dispatchs) => {
  const { isAvaileble, isPower } = states;
  const color = isAvaileble ? "#2e7d32" : "#d32f2f";

  return (
    <Grid container xs={4} justify="center" alignItems="center">
      <Button
        onClick={() => submit(states, dispatchs)}
        color="secondary"
        variant="contained"
        disabled={!isPower}
        style={isPower ? { backgroundColor: color } : {}}
      >
        {isPower && !isAvaileble ? "Cancelar Ensaio" : "Iniciar Ensaio"}
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
        {renderSubmitTest(states, dispatchs)}
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
      isAvaileble: true,
      isPower: false
    };
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
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
      changeConfig
    } = this.props;
    const {
      allCalibration,
      allConfiguration,
      isAvaileble,
      isPower
    } = this.state;
    const states = {
      calibId,
      configId,
      calibration,
      configuration,
      isAvaileble,
      isPower,
      allCalibration,
      allConfiguration
    };
    const dispatchs = { sendMessage, redirect, changeCalib, changeConfig };
    const functions = { handleChangeSelect: this.handleChangeSelect, classes };
    return (
      <div style={{ flex: 1 }}>{allFields(states, dispatchs, functions)}</div>
    );
  }
}

General.defaultProps = {
  calibId: "",
  configId: "",
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
  redirect: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload)),
  changeCalib: payload => dispatch(changeCalibTest(payload)),
  changeConfig: payload => dispatch(changeConfigTest(payload)),
  redirect: payload => dispatch(redirectPage(payload))
});

const mapStateToProps = state => {
  return {
    configId: state.testReducer.configId,
    calibId: state.testReducer.calibId,
    calibration: state.form.calibration,
    configuration: state.form.configuration
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(General));
