import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, FormControlLabel, Grid } from "@material-ui/core";
import styles from "./Styles";
import RealTimeChart from "./RealTimeChart";

const allSpace = 12;
const halfSpace = 6;

const label = name => {
  let nameLabel = "";
  switch (name) {
    case "CHVB":
      nameLabel = "Canal de aquisição";
      break;
    case "Vmv":
      nameLabel = "Vibração(mv)";
      break;
    case "PVmv":
      nameLabel = "Plota Vibração(mv)";
      break;
    case "Vg":
      nameLabel = "Vibração(g)";
      break;
    case "PVg":
      nameLabel = "Plota Vibração(g)";
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

const checkbox = (type, size) => {
  return (
    <Grid alignItems="center" justify="center" container item xs={size}>
      <FormControlLabel
        control={
          <Field component={Checkbox} name={type.name} value={type.value} />
        }
        label={label(type.name)}
      />
    </Grid>
  );
};

const field = (type, classes, size) => {
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      item
      xs={size}
      className={classes.grid}
    >
      <Field
        id={type.name}
        component={TextField}
        label={label(type.name)}
        value={type.value}
        // onChange={handleChange}
        type="number"
        name={type.name}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    </Grid>
  );
};

const freeFields = (states, classes, size) => {
  const fields = states.map(value => {
    return (
      <Grid alignItems="center" justify="center" item xs={size}>
        {field(value, classes, allSpace)}
      </Grid>
    );
  });
  return fields;
};

const vibrationUnits = (states, classes, size) => {
  return (
    <Grid alignItems="center" container justify="center" item xs={size}>
      {field(states[0], classes, halfSpace)}
      {checkbox(states[1], halfSpace)}
    </Grid>
  );
};

const allFields = (states, classes) => {
  return (
    <Grid alignItems="center" justify="center" container item xs={allSpace}>
      <Grid alignItems="center" justify="center" item xs={allSpace}>
        {field(states[0], classes, halfSpace)}
      </Grid>
      {vibrationUnits(states[1], classes, allSpace)}
      {vibrationUnits(states[2], classes, allSpace)}
      <Grid alignItems="center" justify="center" container item xs={allSpace}>
        {freeFields(states[3], classes, halfSpace)}
      </Grid>
    </Grid>
  );
};

class Vibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CHVB: "", // canal de aquisição
      Vmv: "", // Vibration(mv)
      PVmv: false, // plota vibration(mv)
      Vg: "", // vibration(g)
      PVg: false, // plota vibration (g)
      FCVB: "", // fator de conversão
      OFVB: "" // Offset de rotação
    };
  }

  render() {
    const { CHVB, FCVB, OFVB, Vmv, PVmv, Vg, PVg } = this.state;
    const { classes } = this.props;
    const states = [
      { name: "CHVB", value: CHVB },
      [{ name: "Vmv", value: Vmv }, { name: "PVmv", value: PVmv }],
      [{ name: "Vg", value: Vg }, { name: "PVg", value: PVg }],
      [{ name: "FCVB", value: FCVB }, { name: "OFVB", value: OFVB }]
    ];
    return (
      <Grid>
        <Grid
          alignItems="center"
          justify="center"
          container
          item
          xs={allSpace}
          style={{ minHeight: "60vh" }}
          spacing={8}
        >
          <form
            className={classes.container}
            /*
             * onSubmit={handleSubmit(values => {
             *   submit(values, this.state);
             * })}
             */
          >
            <Grid xs />
            <Grid
              container
              item
              direction="column"
              alignItems="center"
              justify="center"
              xs={6}
            >
              {allFields(states, classes)}
            </Grid>
            <Grid xs />
          </form>
        </Grid>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <RealTimeChart />
        </div>
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
