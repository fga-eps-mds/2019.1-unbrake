import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { initialize, reduxForm, change } from "redux-form";
import * as emitter from "emitter-io";
import RealTimeChart from "../components/RealTimeChart";
import { changeConfigTest, changeCalibTest } from "../actions/TestActions";
import General from "./General";
import { API_URL_GRAPHQL, MQTT_HOST, MQTT_PORT } from "../utils/Constants";
import Request from "../utils/Request";

import {
  base10,
  linearEquation,
  convertDigitalToAnalog,
  frequencyEquation,
  rotationsPerMinuteEquation,
  rotationToSpeed,
  travelledDistanceEquation
} from "../utils/Equations";

const margin = 1.5;
const zeroTab = 0;
const firstTab = 1;
const secondTab = 2;
const thirdTab = 3;
const fourthTab = 4;
const fifthTab = 5;
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

const generalComponent = mqttKey => {
  return <Grid xs>{mqttKey !== "" && <General mqttKey={mqttKey} />}</Grid>;
};

const calculePressure = (states, vector) => {
  const { dispatch, msg } = states;

  const analogMesg = convertDigitalToAnalog(parseInt(msg.asString(), base10));
  vector.push(analogMesg);

  dispatch(change("testAquisition", "Pc", analogMesg));
};

const calculeSpeed = (states, vector) => {
  const { dispatch, msg } = states;

  const analogMesg = convertDigitalToAnalog(parseInt(msg.asString(), base10));
  vector.push(analogMesg);

  dispatch(change("testAquisition", "Vc", analogMesg));
};

const calculeFrequency = (states, vector) => {
  const { RAP } = states.calibration.values;
  const { dispatch, msg } = states;

  const analogMesg = convertDigitalToAnalog(parseInt(msg.asString(), base10));
  vector.push(analogMesg);

  const frequency = frequencyEquation(analogMesg);
  const rotationsPerMinute = rotationsPerMinuteEquation(frequency);
  const speedKmh = rotationToSpeed(rotationsPerMinute, RAP, "km/h");

  dispatch(change("testAquisition", "Rrpm", frequency));
  dispatch(change("testAquisition", "Vkmg", speedKmh));
};

const calculeForce = (states, vector, sensorNumber) => {
  const { FCF1, OFF1, FCF2, OFF2 } = states.calibration.values;
  const { dispatch, msg } = states;

  const analogMesg = convertDigitalToAnalog(parseInt(msg.asString(), base10));
  vector.push(analogMesg);

  const linear = linearEquation(
    analogMesg,
    sensorNumber === 1 ? FCF1 : FCF2,
    sensorNumber === 1 ? OFF1 : OFF2
  );
  dispatch(change("testAquisition", `Fkgf${sensorNumber}`, linear));
};

const calculeTemperature = (states, vector, sensorNumber) => {
  const { FCT1, OFT1, FCT2, OFT2 } = states.calibration.values;
  const { dispatch, msg } = states;

  const analogMesg = convertDigitalToAnalog(parseInt(msg.asString(), base10));
  vector.push(analogMesg);

  const linear = linearEquation(
    analogMesg,
    sensorNumber === 1 ? FCT1 : FCT2,
    sensorNumber === 1 ? OFT1 : OFT2
  );
  // console.log(linear, analogMesg, FCT1, OFT1, sensorNumber, states)

  dispatch(change("testAquisition", `Tc${sensorNumber}`, linear));
};

class TabMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      mqttKey: ""
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

    this.sensorTemperature1 = [];
    this.sensorTemperature2 = [];
    this.sensorForce1 = [];
    this.sensorForce2 = [];
    this.sensorSpeed = [];
    this.sensorSpeedCommand = [];
    this.sensorPressureComand = [];

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    const { dispatch, calibration } = this.props;

    this.client.on("message", msg => {
      const { testAquisition } = this.props;
      const states = { calibration, dispatch, msg, testAquisition };

      if (msg.channel === "unbrake/galpao/temperature/sensor1/") {
        calculeTemperature(states, this.sensorTemperature1, 1);
      } else if (msg.channel === "unbrake/galpao/temperature/sensor2/") {
        calculeTemperature(states, this.sensorTemperature2, 2);
      } else if (msg.channel === "unbrake/galpao/brakingForce/sensor1/") {
        calculeForce(states, this.sensorForce1, 1);
      } else if (msg.channel === "unbrake/galpao/brakingForce/sensor2/") {
        calculeForce(states, this.sensorForce2, 2);
      } else if (msg.channel === "unbrake/galpao/frequency/") {
        calculeFrequency(states, this.sensorSpeed);
      } else if (msg.channel === "unbrake/galpao/speed/") {
        calculeSpeed(states, this.sensorSpeedCommand);
      } else if (msg.channel === "unbrake/galpao/pressure/") {
        calculePressure(states, this.sensorPressureComand);
      }
    });
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
          {value === firstTab && <RealTimeChart />}
          {value === secondTab && <RealTimeChart />}
          {value === thirdTab && <RealTimeChart />}
          {value === fourthTab && <RealTimeChart />}
          {value === fifthTab && <RealTimeChart />}
        </Grid>
      </Grid>
    );
  }
}

TabMenuComponent.defaultProps = {
  calibration: { values: {} },
  testAquisition: { values: {} }
};

TabMenuComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  changeCalib: PropTypes.func.isRequired,
  changeConfig: PropTypes.func.isRequired,
  calibration: PropTypes.string,
  testAquisition: PropTypes.string
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
