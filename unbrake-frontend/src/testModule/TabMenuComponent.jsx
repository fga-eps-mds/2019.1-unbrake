import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm, change } from "redux-form";
import * as emitter from "emitter-io";
import RealTimeChart from "../components/RealTimeChart";
import { changeConfigTest, changeCalibTest } from "../actions/TestActions";
import General from "./General";
import { MQTT_HOST, MQTT_PORT } from "../utils/Constants";
import {
  calculePressure,
  calculeSpeed,
  calculeFrequency,
  calculeForce,
  calculeTemperature,
  styles
} from "./TestFunctions";

const zeroTab = 0;
const firstTab = 1;
const secondTab = 2;
const thirdTab = 3;
const fourthTab = 4;
const fifthTab = 5;
const invalidId = 0;
const zero = 0;
const one = 1;
const two = 2;
const convertMeters = 1000;

const generalComponent = mqttKey => {
  return <Grid xs>{mqttKey !== "" && <General mqttKey={mqttKey} />}</Grid>;
};

const doubleGraph = (sensorOne, sensorTwo, label) => {
  return (
    <RealTimeChart
      sensor1={sensorOne}
      sensor2={sensorTwo}
      labelSensor1={label.one}
      colorSensor1="#133e79"
      labelSensor2={label.two}
      colorSensor2="#348941"
    />
  );
};

const oneGraph = (sensorOne, label) => {
  return (
    <RealTimeChart
      sensor1={sensorOne}
      labelSensor1={label}
      colorSensor1="#133e79"
    />
  );
};

const setCheckboxes = (states, dispatch) => {
  dispatch(change("testAquisition", "acelerate", states[0]));
  dispatch(change("testAquisition", "brake", states[1]));
  dispatch(change("testAquisition", "cooldown", states[2]));
};

const verifyCheckbox = (functions, state) => {
  const { dispatch } = functions;
  if (state === "acelerating" || state === "aceleratingWater") {
    setCheckboxes([true, false, false], dispatch);
  } else if (state === "braking" || state === "brakingWater") {
    setCheckboxes([false, true, false], dispatch);
  } else if (state === "cooldown" || state === "cooldownWater") {
    setCheckboxes([false, false, true], dispatch);
  } else {
    setCheckboxes([false, false, false], dispatch);
  }
  if (
    state === "aceleratingWater" ||
    state === "brakingWater" ||
    state === "cooldownWater"
  ) {
    dispatch(change("testAquisition", "water", true));
  } else dispatch(change("testAquisition", "water", false));
};

const continueResolves = (msg, functions) => {
  if (msg.channel === "unbrake/galpao/distance/") {
    functions.dispatch(
      change("testAquisition", "DPm", msg.asString() * convertMeters)
    );
  } else if (msg.channel === "unbrake/galpao/snubState/") {
    verifyCheckbox(functions, msg.asString());
  } else if (msg.channel === "unbrake/galpao/isAvailable/") {
    if (msg.asString() === "true") verifyCheckbox(functions, "");
  }
};

const resolveMsg = (msg, states, functions) => {
  if (msg.channel === "unbrake/galpao/temperature/sensor1/") {
    calculeTemperature(states, states.sensorTemperature1, one);
  } else if (msg.channel === "unbrake/galpao/temperature/sensor2/") {
    calculeTemperature(states, states.sensorTemperature2, two);
  } else if (msg.channel === "unbrake/galpao/brakingForce/sensor1/") {
    calculeForce(states, states.sensorForce1, one);
  } else if (msg.channel === "unbrake/galpao/brakingForce/sensor2/") {
    calculeForce(states, states.sensorForce2, two);
  } else if (msg.channel === "unbrake/galpao/frequency/") {
    calculeFrequency(states, states.sensorRpm);
  } else if (msg.channel === "unbrake/galpao/speed/") {
    calculeSpeed(states, states.sensorSpeedCommand);
  } else if (msg.channel === "unbrake/galpao/pressure/") {
    calculePressure(states, states.sensorPressureComand);
  } else continueResolves(msg, functions);
};

class TabMenuComponent extends React.Component {
  /* eslint-disable max-lines-per-function, max-statements */
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.client = emitter.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      secure: false
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/temperature/sensor1"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/temperature/sensor2"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/brakingForce/sensor1"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/brakingForce/sensor2"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/frequency"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/speed/"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/pressure/"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/distance/"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/snubState"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/isAvailable/" // isAvailable
    });

    this.sensorTemperature1 = [];
    this.sensorTemperature2 = [];
    this.sensorForce1 = [];
    this.sensorForce2 = [];
    this.sensorRpm = [];
    this.sensorSpeedCommand = [];
    this.sensorPressureComand = [];

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    const { dispatch, calibration } = this.props;
    // this.client.on("message", msg => {
    //   const { testAquisition } = this.props;
    //   const states = {
    //     calibration,
    //     dispatch,
    //     msg,
    //     testAquisition,
    //     sensorTemperature1: this.sensorTemperature1,
    //     sensorTemperature2: this.sensorTemperature2,
    //     sensorForce1: this.sensorForce1,
    //     sensorForce2: this.sensorForce2,
    //     sensorRpm: this.sensorRpm,
    //     sensorSpeedCommand: this.sensorSpeedCommand,
    //     sensorPressureComand: this.sensorPressureComand
    //   };
    //   const functions = { dispatch, change };

    //   if (Object.keys(calibration.values).length > zero) {
    //     resolveMsg(msg, states, functions);
    //   }
    // });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    console.log(prevProps, prevState, snapshot)
    const { dispatch, calibration } = this.props;

    if (calibration !== prevProps.calibration){
    this.client.on("message", msg => {
      const { testAquisition } = this.props;
      const states = {
        calibration,
        dispatch,
        msg,
        testAquisition,
        sensorTemperature1: this.sensorTemperature1,
        sensorTemperature2: this.sensorTemperature2,
        sensorForce1: this.sensorForce1,
        sensorForce2: this.sensorForce2,
        sensorRpm: this.sensorRpm,
        sensorSpeedCommand: this.sensorSpeedCommand,
        sensorPressureComand: this.sensorPressureComand
      };
      const functions = { dispatch, change };

      if (Object.keys(calibration.values).length > zero) {
        resolveMsg(msg, states, functions);
      }
    });
    return true;
  }
  return false;
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  handleChangeSelect(event) {
    const { changeCalib, changeConfig } = this.props;
    const { name, value } = event.target;

    const id = value === invalidId ? "" : value;

    if (name === "configId") changeConfig({ configId: id });
    else if (name === "calibId") changeCalib({ calibId: id });
  }

  render() {
    const { classes, mqttKey } = this.props;
    const { value } = this.state;

    const labelTemp = { one: "Temperatura 1", two: "Temperatura 2" };
    const labelForce = { one: "Força 1", two: "Força 2" };

    return (
      <Grid
        item
        container
        xs={12}
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item container xs={11} justify="center" alignItems="center">
          <AppBar
            color="inherit"
            className={classes.appBar}
            position="relative"
          >
            <Tabs centered value={value} onChange={this.handleChange}>
              <Tab label="Gerais" />
              <Tab label="Temperatura" />
              <Tab label="Força" />
              <Tab label="Rotação" />
              <Tab label="Velocidade" />
              <Tab label="Distância" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid
          item
          container
          xs={11}
          justify="center"
          alignItems="center"
          style={{ paddingTop: "15px" }}
        >
          {value === zeroTab && generalComponent(mqttKey)}
          {value === firstTab &&
            doubleGraph(
              this.sensorTemperature1,
              this.sensorTemperature2,
              labelTemp
            )}
          {value === secondTab &&
            doubleGraph(this.sensorForce1, this.sensorForce2, labelForce)}
          {value === thirdTab && oneGraph(this.sensorRpm, "Frequência")}
          {value === fourthTab &&
            oneGraph(this.sensorSpeedCommand, "Velocidade (comando)")}
          {value === fifthTab && <RealTimeChart />}
        </Grid>
      </Grid>
    );
  }
}

TabMenuComponent.defaultProps = {
  calibration: { values: {} },
  testAquisition: { values: {} },
  mqttKey: ""
};

TabMenuComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  changeCalib: PropTypes.func.isRequired,
  changeConfig: PropTypes.func.isRequired,
  calibration: PropTypes.string,
  testAquisition: PropTypes.string,
  mqttKey: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    configId: state.testReducer.configId,
    calibId: state.testReducer.calibId,
    calibration: state.form.calibration,
    testAquisition: state.form.testAquisition
  };
};

const mapDispatchToProps = dispatch => ({
  changeCalib: payload => dispatch(changeCalibTest(payload)),
  changeConfig: payload => dispatch(changeConfigTest(payload))
});

const MenuComponent = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(TabMenuComponent);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MenuComponent));
