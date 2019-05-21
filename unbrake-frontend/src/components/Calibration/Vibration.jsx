import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, FormControlLabel, Grid } from "@material-ui/core";
import styles from "../Styles";
import RealTimeChart from "../RealTimeChart";

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

const checkbox = (type, handleChange) => {
  return (
    <Grid alignItems="center" justify="center" container item xs={6}>
      <FormControlLabel
        control={
          <Field
            disabled={type.disable}
            component={Checkbox}
            onClick={handleChange}
            name={type.name}
            value={type.value}
          />
        }
        label={label(type.name)}
      />
    </Grid>
  );
};

const field = (type, style, handleChange) => {
  const classes = style[0];
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      item
      xs={style[1]}
      className={classes.grid}
    >
      <Field
        id={type.name}
        component={TextField}
        label={label(type.name)}
        value={type.value}
        onChange={handleChange}
        disabled={type.disable}
        type="number"
        name={type.name}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    </Grid>
  );
};

const freeFields = (states, style, handleChange) => {
  const newStyle = style;
  newStyle[1] = allSpace;
  const fields = states.map(value => {
    return (
      <Grid key={value.name} item xs={6}>
        {field(value, newStyle, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const vibrationUnits = (states, style, handleChange) => {
  return (
    <Grid alignItems="center" container justify="center" item xs={12}>
      {field(states[0], style, handleChange)}
      {checkbox(states[1], handleChange)}
    </Grid>
  );
};

const allFields = (states, classes, handleChange) => {
  const style = [classes, halfSpace];
  return (
    <Grid alignItems="center" justify="center" container item xs={allSpace}>
      <Grid item xs={allSpace}>
        {field(states[0], style, handleChange)}
      </Grid>

      {vibrationUnits(states[1], style, handleChange)}
      {vibrationUnits(states[2], style, handleChange)}

      <Grid alignItems="center" justify="center" container item xs={allSpace}>
        {freeFields(states[3], style, handleChange)}
      </Grid>
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
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const vibration = { [event.target.name]: value };
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
          <form
            className={classes.container}
            //  onSubmit={handleSubmit(values => {submit(values, this.state)})}
          >
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
