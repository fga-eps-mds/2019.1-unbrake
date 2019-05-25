import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../Styles";
import RealTimeChart from "../RealTimeChart";
import { checkbox, field } from "./CalibrationComponents";

const renderField = (states, classes, handleChange) => {
  return (
    <Grid alignItems="center" justify="center" container item xs={6}>
      {field(states, classes, handleChange)}

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

const vibrationUnits = (states, classes, handleChange) => {
  return (
    <Grid alignItems="center" container justify="center" item xs={12}>
      {renderField(states[0], classes, handleChange)}

      <Grid alignItems="center" justify="center" container item xs={6}>
        {checkbox(states[1], handleChange)}
      </Grid>
    </Grid>
  );
};

const allFields = (states, classes, handleChange) => {
  return (
    <Grid alignItems="center" justify="center" container item xs={12}>
      <Grid item xs={12}>
        {renderField(states[0], classes, handleChange)}
      </Grid>

      {vibrationUnits(states[1], classes, handleChange)}
      {vibrationUnits(states[2], classes, handleChange)}

      {freeFields(states[3], classes, handleChange)}
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
        PVmv: false, // plota vibration(mv)
        Vg: "", // vibration(g)
        PVg: false, // plota vibration (g)
        FCVB: "", // fator de conversão
        OFVB: "" // Offset de rotação
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, type, value, checked } = event;
    const newValue = type === "checkbox" ? checked : value;
    const vibration = { [name]: newValue };

    this.setState(prevState => ({
      vibration: { ...prevState.vibration, ...vibration }
    }));
  }

  render() {
    const { vibration } = this.state;
    const { CHVB, FCVB, OFVB, Vmv, PVmv, Vg, PVg } = vibration;
    const { classes } = this.props;
    const states = [
      { name: "CHVB", value: CHVB, disable: true },
      [
        { name: "Vmv", value: Vmv, disable: true },
        { name: "PVmv", value: PVmv, disable: false }
      ],
      [
        { name: "Vg", value: Vg, disable: true },
        { name: "PVg", value: PVg, disable: false }
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
          style={{ minHeight: "60vh" }}
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
          <RealTimeChart />
        </Grid>
      </Grid>
    );
  }
}

Vibration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const VibrationForm = reduxForm({
  form: "calibration"
})(Vibration);

export default withStyles(styles)(VibrationForm);
