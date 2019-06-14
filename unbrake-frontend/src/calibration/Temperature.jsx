import React from "react";
import PropTypes from "prop-types";
import { reduxForm, change } from "redux-form";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import * as emitter from "emitter-io";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { field } from "../components/ComponentsForm";

const labelSecondary = name => {
  let nameLabel = "";
  switch (name) {
    case "OFT1":
      nameLabel = "Offset 1";
      break;
    case "OFT2":
      nameLabel = "Offset 2";
      break;
    case "PT1":
      nameLabel = "Plota Temperatura 1";
      break;
    case "PT2":
      nameLabel = "Plota temperatura 2";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

const label = name => {
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
    case "TC1":
      nameLabel = "Temperatura 1 (°C)";
      break;
    case "TC2":
      nameLabel = "Temperatura 2 (°C)";
      break;
    case "FCT1":
      nameLabel = "Fator de conversão 1";
      break;
    case "FCT2":
      nameLabel = "Fator de conversão 1";
      break;
    default:
      nameLabel = labelSecondary(name);
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = label(states.name);
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

const renderDictionary = force => {
  const {
    CHF1,
    CHF2,
    FCF1,
    FCF2,
    Fmv1,
    Fmv2,
    Fkgf1,
    Fkgf2,
    OFF1,
    OFF2
  } = force;
  const directionary = [
    [
      { name: "CHT1", value: CHF1, disable: true },
      { name: "CHT2", value: CHF2, disable: true }
    ],
    [
      { name: "Tmv1", value: Fmv1, disable: true },
      { name: "Tmv2", value: Fmv2, disable: true }
    ],
    [
      { name: "TC1", value: Fkgf1, disable: true },
      { name: "TC2", value: Fkgf2, disable: true }
    ],
    [
      { name: "FCT1", value: FCF1, disable: false },
      { name: "FCT2", value: FCF2, disable: false }
    ],
    [
      { name: "OFT1", value: OFF1, disable: false },
      { name: "OFT2", value: OFF2, disable: false }
    ]
  ];
  return directionary;
};

class Temperature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      force: {
        CHF1: "", // canal de aquisição 1
        CHF2: "", // canal de aquisição 2
        PFkgf1: false, // plota força (kfg) 1
        Fmv1: "100", // força (mv) 1
        Fmv2: "", // força (mv) 2
        PFkgf2: false, // plota força (kfg) 1
        Fkgf1: "", // força (kgf) 1
        Fkgf2: "", // força (kgf) 2
        FCF1: "", // fator de conversão 1
        FCF2: "", // fator de conversão 2
        OFF1: "", // offset de força 1
        OFF2: "" // offset de força 2
      }
    };
    this.client = emitter.connect({
      host: "unbrake.ml",
      port: 8080,
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
    this.client.on("message", msg => {
      const { dispatch } = this.props;
      if (msg.channel === "unbrake/galpao/temperature/sensor1/") {
        dispatch(change("calibration", "Tmv1", msg.asString()));
        this.sensor1.push(parseInt(msg.asString(), 10));
      } else if (msg.channel === "unbrake/galpao/temperature/sensor2/") {
        this.sensor2.push(parseInt(msg.asString(), 10));
        dispatch(change("calibration", "Tmv2", msg.asString()));
      }
    });
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const force = { [event.target.name]: value };
    this.setState(prevState => ({
      force: { ...prevState.force, ...force }
    }));
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
        style={{ marginTop: "70px" }}
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
  dispatch: PropTypes.func.isRequired
};

const TemperatureForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Temperature);

export default connect()(withStyles(styles)(TemperatureForm));
