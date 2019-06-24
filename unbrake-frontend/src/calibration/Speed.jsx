import React from "react";
import PropTypes from "prop-types";
import { reduxForm, change } from "redux-form";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import * as emitter from "emitter-io";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { field } from "../components/ComponentsForm";
import { MQTT_HOST, MQTT_PORT } from "../utils/Constants";
import {
  base10,
  convertDigitalToAnalog,
  frequencyEquation,
  rotationsPerMinuteEquation,
  rotationToSpeed,
  travelledDistanceEquation
} from "../utils/Equations";
import { changeCalibTest } from "../actions/TestActions";

const invalidId = 0;

const labelSecondary = name => {
  let nameLabel = "";
  switch (name) {
    case "Vkmh":
      nameLabel = "Velocidade (Km/h)";
      break;
    case "Vms":
      nameLabel = "Velocidade (m/s)";
      break;
    case "DPkm":
      nameLabel = "Distância percorrida (km)";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

export const labelSpeed = name => {
  let nameLabel = "";
  switch (name) {
    case "CHR1":
      nameLabel = "Canal de aquisição";
      break;
    case "Fhz":
      nameLabel = "Frequência (Hz)";
      break;
    case "Rrpm":
      nameLabel = "Rotação (RPM)";
      break;
    case "RAP":
      nameLabel = "Raio do pneu (m)";
      break;
    default:
      nameLabel = labelSecondary(name);
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = labelSpeed(states.name);
  return <React.Fragment>{field(type, classes, handleChange)}</React.Fragment>;
};

const rowField = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid
        key={`component ${value.name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={6}
      >
        {renderField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const allFields = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
        key={`fields ${value[0].name}`}
      >
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const renderDictionary = speed => {
  const directionary = [
    [{ name: "CHR1", value: speed.CHR1, disable: true }],
    [
      { name: "Fhz", value: speed.Fhz, disable: true },
      { name: "Vkmh", value: speed.Vkmh, disable: true }
    ],
    [
      { name: "Rrpm", value: speed.Rrpm, disable: true },
      { name: "Vms", value: speed.Vms, disable: true }
    ],
    [
      { name: "RAP", value: speed.RAP, disable: false },
      { name: "DPkm", value: speed.DPkm, disable: true }
    ]
  ];
  return directionary;
};

const updateFields = (analogMsg, dispatch, tireRadius) => {
  const frequency = frequencyEquation(analogMsg);
  const rotationsPerMinute = rotationsPerMinuteEquation(frequency);
  const speedMS = rotationToSpeed(rotationsPerMinute, tireRadius, "m/s");
  const speedKmh = rotationToSpeed(rotationsPerMinute, tireRadius, "km/h");
  const travelledDistance = travelledDistanceEquation(speedKmh);

  dispatch(change("calibration", "Fhz", frequency));
  dispatch(change("calibration", "Rrpm", rotationsPerMinute));
  dispatch(change("calibration", "Vms", speedMS));
  dispatch(change("calibration", "Vkmh", speedKmh));
  dispatch(change("calibration", "DPkm", travelledDistance));
};

class Speed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: {
        CHR1: "", // canal de aquisição
        Fhz: "", // frequencia
        Vkmh: "", // velocidade km/h
        Rrpm: "", // rotação
        RAP: "", // raio pneu
        Vms: "", // velocidade m/s
        DPkm: "" // distância percorrida
      }
    };
    this.client = emitter.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      secure: false
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/frequency"
    });
    this.sensor = [];
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.client.on("message", msg => {
      const { calibration } = this.props;
      const { values } = calibration;
      const { RAP } = values;
      const analogMsg = convertDigitalToAnalog(
        parseInt(msg.asString(), base10)
      );
      if (msg.channel === "unbrake/galpao/frequency/") {
        this.sensor.push(analogMsg);
        updateFields(analogMsg, dispatch, RAP);
      }
    });
  }

  handleChange(event) {
    const { calibId, changeCalib } = this.props;
    const { target } = event;

    const value = target.type === "checkbox" ? target.checked : target.value;
    const force = { [event.target.name]: value };
    this.setState(prevState => ({
      force: { ...prevState.force, ...force }
    }));

    if (calibId > invalidId) changeCalib({ calibId: "" });
  }

  render() {
    const { speed } = this.state;
    const { classes } = this.props;
    const states = renderDictionary(speed);
    return (
      <Grid
        container
        xs={12}
        item
        justify="center"
        style={{ marginTop: "10px" }}
      >
        <Grid alignItems="center" justify="center" container>
          <form className={classes.container}>
            <Grid item xs />
            <Grid container item justify="center" xs={6}>
              {allFields(states, classes, this.handleChange)}
            </Grid>
            <Grid item xs />
          </form>
        </Grid>

        <Grid
          item
          container
          xs={9}
          justify="center"
          className={classes.gridGraphic}
        >
          <RealTimeChart
            sensor1={this.sensor}
            labelSensor1="Frequência"
            colorSensor1="#133e79"
          />
        </Grid>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeCalib: payload => dispatch(changeCalibTest(payload))
});

const mapStateToProps = state => ({
  calibId: state.testReducer.calibId,
  calibration: {
    values: {
      RAP: state.form.calibration.values.RAP
    }
  }
});

Speed.defaultProps = {
  calibId: ""
};

Speed.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  mqttKey: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  calibration: PropTypes.objectOf(PropTypes.string).isRequired,
  calibId: PropTypes.number,
  changeCalib: PropTypes.func.isRequired
};

const SpeedForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Speed);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SpeedForm));
