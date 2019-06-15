import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { checkbox, field } from "../components/ComponentsForm";

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

const allCheckbox = (selectsControl, classes, handleChange) => {
  const checks = selectsControl.map(value => {
    const type = value;
    type.label = labelTemperature(value.name);
    return (
      <Grid
        key={`checkbox ${value.name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
        className={classes.checboxSize}
      >
        {checkbox(type, handleChange)}
      </Grid>
    );
  });
  return checks;
};

const renderDictionary = force => {
  const { CHT1, CHT2, Tmv1, Tmv2, Tc1, Tc2, FCT1, FCT2, OFT1, OFT2 } = force;
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
        PT1: false, // plota temperatura 1
        Tmv1: "", // temperatura (mv) 1
        Tmv2: "", // temperatura (mv) 2
        PT2: false, // plota temperatura 2
        Tc1: "", // temperatura (c) 1
        Tc2: "", // temperatura (c) 2
        FCT1: "", // fator de conversão 1
        FCT2: "", // fator de conversão 2
        OFT1: "", // offset de temperatura 1
        OFT2: "" // offset de temperatura 2
      }
    };
    this.handleChange = this.handleChange.bind(this);
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
    const { temperature } = this.state;
    const { PT1, PT2 } = temperature;
    const { classes } = this.props;
    const states = renderDictionary(temperature);
    const selectsControl = [
      { name: "PT1", value: PT1, disable: false },
      { name: "PT2", value: PT2, disable: false }
    ];
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
            <Grid
              container
              item
              alignItems="flex-start"
              justify="center"
              xs={3}
            >
              <Grid container item alignItems="center" justify="center" xs={12}>
                {allCheckbox(selectsControl, classes, this.handleChange)}
              </Grid>
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
          <RealTimeChart />
        </Grid>
      </Grid>
    );
  }
}

Temperature.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const TemperatureForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Temperature);

export default withStyles(styles)(TemperatureForm);
