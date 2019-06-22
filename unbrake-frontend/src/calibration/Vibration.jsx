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
  linearEquation,
  convertDigitalToAnalog
} from "../utils/Equations";
import { changeCalibTest } from "../actions/TestActions";

const invalidId = 0;

export const labelVibration = name => {
  let nameLabel = "";
  switch (name) {
    case "CHVB":
      nameLabel = "Canal de aquisição";
      break;
    case "Vmv":
      nameLabel = "Vibração(mv)";
      break;
    case "Vg":
      nameLabel = "Vibração(g)";
      break;
    case "FCVB":
      nameLabel = "Fator de conversão";
      break;
    case "OFVB":
      nameLabel = "Offset";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = labelVibration(states.name);
  return (
    <Grid alignItems="center" justify="center" container item xs={6}>
      {field(type, classes, handleChange)}
    </Grid>
  );
};

const freeFields = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <React.Fragment>
        {renderField(value, classes, handleChange)}
      </React.Fragment>
    );
  });
  return fields;
};

const allFields = (states, classes, handleChange) => {
  return (
    <Grid alignItems="center" justify="center" container item xs={12}>
      <Grid item xs={12}>
        {renderField(states[0], classes, handleChange)}
      </Grid>

      {freeFields(states[1], classes, handleChange)}
      {freeFields(states[2], classes, handleChange)}
    </Grid>
  );
};

class Vibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vibration: {
        CHVB: "", // canal de aquisição
        Vmv: "", // Vibration(mv)
        Vg: "", // vibration(g)
        FCVB: "", // fator de conversão
        OFVB: "" // Offset de rotação
      }
    };
    this.client = emitter.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      secure: false
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/vibration"
    });
    this.sensor = [];
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.client.on("message", msg => {
      const { calibration } = this.props;
      const { values } = calibration;
      const { FCVB, OFVB } = values;
      const analogMsg = convertDigitalToAnalog(
        parseInt(msg.asString(), base10)
      );
      if (msg.channel === "unbrake/galpao/vibration/") {
        this.sensor.push(analogMsg);
        dispatch(change("calibration", "Vmv", analogMsg));
        dispatch(
          change("calibration", "Vg", linearEquation(analogMsg, FCVB, OFVB))
        );
      }
    });
  }

  handleChange(event) {
    const { calibId, changeCalib } = this.props;
    const { name, type, value, checked } = event;

    const newValue = type === "checkbox" ? checked : value;
    const vibration = { [name]: newValue };

    this.setState(prevState => ({
      vibration: { ...prevState.vibration, ...vibration }
    }));

    if (calibId > invalidId) changeCalib({ calibId: "" });
  }

  render() {
    const { vibration } = this.state;
    const { CHVB, FCVB, OFVB, Vmv, Vg } = vibration;
    const { classes } = this.props;
    const states = [
      { name: "CHVB", value: CHVB, disable: true },
      [
        { name: "Vmv", value: Vmv, disable: true },
        { name: "Vg", value: Vg, disable: true }
      ],
      [
        { name: "FCVB", value: FCVB, disable: false },
        { name: "OFVB", value: OFVB, disable: false }
      ]
    ];
    return (
      <Grid container xs={12} item justify="center">
        <Grid
          alignItems="center"
          justify="center"
          container
          style={{ marginTop: "10px" }}
        >
          <form className={classes.container}>
            <Grid item xs />
            <Grid container item justify="center" xs={6}>
              {allFields(states, classes, this.handleChange)}
            </Grid>
            <Grid item xs />
          </form>
        </Grid>

        <Grid item container xs={9} justify="center">
          <RealTimeChart
            sensor1={this.sensor}
            labelSensor1="Vibração"
            colorSensor1="#133e79"
          />
        </Grid>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeCalib: payload => dispatch(changeCalibTest(payload)),
  calibration: {
    values: {
      FCVB: state.form.calibration.values.FCVB,
      OFVB: state.form.calibration.values.OFVB
    }
  }
});

const mapStateToProps = state => ({
  calibId: state.testReducer.calibId
});

Vibration.defaultProps = {
  calibId: ""
};

Vibration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  mqttKey: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  calibration: PropTypes.objectOf(PropTypes.string).isRequired,
  calibId: PropTypes.number,
  changeCalib: PropTypes.func.isRequired
};

const VibrationForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Vibration);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(VibrationForm));
