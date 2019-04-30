import React from "react";
import "../App.css";
import { Field } from "redux-form";
import { TextField, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const styles = () => ({
  grid: {
    margin: "5px"
  },
  div: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center"
  }
});

class CalibrationFields extends React.Component {
  renderField(option) {
    const { classes } = this.props;
    const temperature = {
      name: `temperature_${option}`,
      label: `Temperatura ${option}`
    };
    return (
      <div className={classes.div}>
        <Field
          className={classes.grid}
          name="aquisition_canal"
          component={TextField}
          label="Canal de aquisição"
          variant="outlined"
        />
        <Field
          className={classes.grid}
          name={temperature.name}
          component={TextField}
          placeholder={`${temperature.label} (mV)`}
          label={`${temperature.label} (mV)`}
          variant="outlined"
        />
        <Field
          className={classes.grid}
          name="conversion_fator"
          component={TextField}
          placeholder="Fator de conversão"
          label="Fator de conversão"
          variant="outlined"
        />
        <Field
          className={classes.grid}
          name="offset"
          component={TextField}
          placeholder="Offset"
          label="Offset"
          variant="outlined"
        />
        <Field
          className={classes.grid}
          name={`${temperature.name}_C`}
          component={TextField}
          placeholder={`${temperature.label} (˚C)`}
          label={`${temperature.label} (˚C)`}
          variant="outlined"
        />
      </div>
    );
  }

  render() {
    const { field } = this.props;
    return <div>{this.renderField(field)}</div>;
  }
}

CalibrationFields.propTypes = {
  field: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};
CalibrationFields.defaultProps = {
  field: ""
};

export default withStyles(styles)(CalibrationFields);
