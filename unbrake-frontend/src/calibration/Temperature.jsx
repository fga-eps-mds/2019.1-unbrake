import React from "react";
import PropTypes from "prop-types";
import { reduxForm, change } from "redux-form";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import * as emitter from "emitter-io";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { field } from "../components/ComponentsForm";
import {
  conversionFunction,
  base10,
  MQTT_HOST,
  MQTT_PORT
} from "../utils/Constants";

const labelSecondary = name => {
  let nameLabel = "";
  switch (name) {
    case "OFT1":
      nameLabel = "Offset 1";
      break;
    case "OFT2":
      nameLabel = "Offset 2";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

export const labelTemperature = name => {
  let nameLabel = "";
  switch (name) {
    case "CHT1":
      nameLabel = "Canal de aquisição 1";
      break;
    case "CHT2":
      nameLabel = "Canal de aquisição 2";
      break;
    case "Tmv1":
      nameLabel = "Temperatura 1 (mv)";
      break;
    case "Tmv2":
      nameLabel = "Temperatura 2 (mv)";
      break;
    case "Tc1":
      nameLabel = "Temperatura 1 (°C)";
      break;
    case "Tc2":
      nameLabel = "Temperatura 2 (°C)";
      break;
    case "FCT1":
      nameLabel = "Fator de conversão 1";
      break;
    case "FCT2":
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
  type.label = labelTemperature(states.name);
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
  const rowns = states.map(value => {
    return (
      <Grid
        key={`row ${value[0].name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
      >
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return rowns;
};

const renderDictionary = temperature => {
  const { CHT1, CHT2, Tmv1, Tmv2, Tc1, Tc2, FCT1, FCT2, OFT1, OFT2 } = temperature;
  const directionary = [
    [
      { name: "CHT1", value: CHT1, disable: true },
      { name: "CHT2", value: CHT2, disable: true }
    ],
    [
      { name: "Tmv1", value: Tmv1, disable: true },
      { name: "Tmv2", value: Tmv2, disable: true }
    ],
    [
      { name: "Tc1", value: Tc1, disable: true },
      { name: "Tc2", value: Tc2, disable: true }
    ],
    [
      { name: "FCT1", value: FCT1, disable: false },
      { name: "FCT2", value: FCT2, disable: false }
    ],
    [
      { name: "OFT1", value: OFT1, disable: false },
      { name: "OFT2", value: OFT2, disable: false }
    ]
  ];
  return directionary;
};

class Temperature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: {
        CHT1: "", // canal de aquisição 1
        CHT2: "", // canal de aquisição 2
        Tmv1: "", // temperatura (mv) 1
        Tmv2: "", // temperatura (mv) 2
        Tc1: "", // temperatura (c) 1
        Tc2: "", // temperatura (c) 2
        FCT1: "", // fator de conversão 1
        FCT2: "", // fator de conversão 2
        OFT1: "", // offset de temperatura 1
        OFT2: "" // offset de temperatura 2
      }
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
    this.sensor1 = [];
    this.sensor2 = [];
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.client.on("message", msg => {
      const { calibration } = this.props;
      const { values } = calibration;
      const { FCT1, OFT1, FCT2, OFT2 } = values;
      if (msg.channel === "unbrake/galpao/temperature/sensor1/") {
        this.sensor1.push(parseInt(msg.asString(), base10));
        dispatch(change("calibration", "Tmv1", msg.asString()));
        dispatch(
          change(
            "calibration",
            "Tc1",
            conversionFunction(msg.asString(), FCT1, OFT1)
          )
        );
      } else if (msg.channel === "unbrake/galpao/temperature/sensor2/") {
        this.sensor2.push(parseInt(msg.asString(), base10));
        dispatch(change("calibration", "Tmv2", msg.asString()));
        dispatch(
          change(
            "calibration",
            "Tc2",
            conversionFunction(msg.asString(), FCT2, OFT2)
          )
        );
      }
    });
  }

  handleChange(event) {
    const { target } = event;
    const value = target.value;
    const temperature = { [event.target.name]: value };
    this.setState(prevState => ({
      temperature: { ...prevState.temperature, ...temperature }
    }));
  }

  render() {
    const { temperature } = this.state;
    const { classes } = this.props;
    const states = renderDictionary(temperature);
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
            labelSensor1="Temperatura 1"
            colorSensor1="#133e79"
            labelSensor2="Temperatura 2"
            colorSensor2="#348941"
          />
        </Grid>
      </Grid>
    );
  }
}

Temperature.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  mqttKey: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  calibration: PropTypes.objectOf(PropTypes.string).isRequired
};

const TemperatureForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Temperature);

export default connect(state => ({
  calibration: {
    values: {
      FCT1: state.form.calibration.values.FCT1,
      OFT1: state.form.calibration.values.OFT1,
      FCT2: state.form.calibration.values.FCT2,
      OFT2: state.form.calibration.values.OFT2
    }
  }
}))(withStyles(styles)(TemperatureForm));
