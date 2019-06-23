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

const labelSecondary = name => {
  let nameLabel = "";
  switch (name) {
    case "OFF1":
      nameLabel = "Offset 1";
      break;
    case "OFF2":
      nameLabel = "Offset 2";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

export const labelForce = name => {
  let nameLabel = "";
  switch (name) {
    case "CHF1":
      nameLabel = "Canal de aquisição 1";
      break;
    case "CHF2":
      nameLabel = "Canal de aquisição 2";
      break;
    case "Fmv1":
      nameLabel = "Força 1(mv)";
      break;
    case "Fmv2":
      nameLabel = "Força 2(mv)";
      break;
    case "Fkgf1":
      nameLabel = "Força 1(kgf)";
      break;
    case "Fkgf2":
      nameLabel = "Força 2(kgf)";
      break;
    case "FCF1":
      nameLabel = "Fator de conversão 1";
      break;
    case "FCF2":
      nameLabel = "Fator de conversão 2";
      break;
    default:
      nameLabel = labelSecondary(name);
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = labelForce(states.name);
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
        key={`fields ${value[1].name}`}
      >
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const renderDictionary = force => {
  const directionary = [
    [
      { name: "CHF1", value: force.CHF1, disable: true },
      { name: "CHF2", value: force.CHF2, disable: true }
    ],
    [
      { name: "Fmv1", value: force.Fmv1, disable: true },
      { name: "Fmv2", value: force.Fmv2, disable: true }
    ],
    [
      { name: "Fkgf1", value: force.Fkgf1, disable: true },
      { name: "Fkgf2", value: force.Fkgf2, disable: true }
    ],
    [
      { name: "FCF1", value: force.FCF1, disable: false },
      { name: "FCF2", value: force.FCF2, disable: false }
    ],
    [
      { name: "OFF1", value: force.OFF1, disable: false },
      { name: "OFF2", value: force.OFF2, disable: false }
    ]
  ];
  return directionary;
};

class Force extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      force: {
        CHF1: "", // canal de aquisição 1
        CHF2: "", // canal de aquisição 2
        Fmv1: "", // força (mv) 1
        Fmv2: "", // força (mv) 2
        Fkgf1: "", // força (kgf) 1
        Fkgf2: "", // força (kgf) 2
        FCF1: "", // fator de conversão 1
        FCF2: "", // fator de conversão 2
        OFF1: "", // offset de força 1
        OFF2: "" // offset de força 2
      }
    };
    this.client = emitter.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      secure: false
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/brakingForce/sensor1"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/brakingForce/sensor2"
    });
    this.sensor1 = [];
    this.sensor2 = [];
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let sensorNumber;
    this.client.on("message", msg => {
      const { calibration } = this.props;
      const { values } = calibration;
      const { FCF1, OFF1, FCF2, OFF2 } = values;
      const analogMsg = convertDigitalToAnalog(
        parseInt(msg.asString(), base10)
      );
      if (msg.channel === "unbrake/galpao/brakingForce/sensor1/") {
        sensorNumber = "1";
      } else if (msg.channel === "unbrake/galpao/brakingForce/sensor2/") {
        sensorNumber = "2";
      }
      this.appendSensor(sensorNumber, analogMsg);
      dispatch(change("calibration", `Fmv${sensorNumber}`, analogMsg));
      dispatch(
        change(
          "calibration",
          `Fkgf${sensorNumber}`,
          linearEquation(
            analogMsg,
            sensorNumber === "1" ? FCF1 : FCF2,
            sensorNumber === "1" ? OFF1 : OFF2
          )
        )
      );
    });
  }

  appendSensor(sensorNumber, analogMsg) {
    if (sensorNumber === "1") {
      this.sensor1.push(analogMsg);
    } else if (sensorNumber === "2") {
      this.sensor2.push(analogMsg);
    }
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
    const { force } = this.state;
    const { classes } = this.props;
    const states = renderDictionary(force);
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
            sensor1={this.sensor1}
            sensor2={this.sensor2}
            labelSensor1="Força 1"
            colorSensor1="#133e79"
            labelSensor2="Força 2"
            colorSensor2="#348941"
          />
        </Grid>
      </Grid>
    );
  }
}

Force.defaultProps = {
  calibId: ""
};

Force.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  mqttKey: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  calibration: PropTypes.objectOf(PropTypes.string).isRequired,
  calibId: PropTypes.number,
  changeCalib: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  changeCalib: payload => dispatch(changeCalibTest(payload))
});

const mapStateToProps = state => ({
  calibId: state.testReducer.calibId,
  calibration: {
    values: {
      FCF1: state.form.calibration.values.FCF1,
      OFF1: state.form.calibration.values.OFF1,
      FCF2: state.form.calibration.values.FCF2,
      OFF2: state.form.calibration.values.OFF2
    }
  }
});

const ForceForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Force);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ForceForm));
