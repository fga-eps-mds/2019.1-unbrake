import React from "react";
import "../App.css";
import { Field } from "redux-form";
import { TextField, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const FIRST_FIELD = "firstField";
const SECOND_FIELD = "secondField";

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
  renderFields1() {
    const { field, classes } = this.props;
    if (field === FIRST_FIELD)
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
            name="temperature_1"
            component={TextField}
            placeholder="Temperatura 1 (mV)"
            label="Temperatura 1 (mV)"
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
            name="temperature_1_C"
            component={TextField}
            placeholder="Temperatura 1 (°C)"
            label="Temperatura 1 (°C)"
            variant="outlined"
          />
        </div>
      );
    return null;
  }

  renderFields2() {
    const { field, classes } = this.props;
    if (field === SECOND_FIELD)
      return (
        <div className={classes.div}>
          <Field
            className={classes.grid}
            name="aquisition_canal"
            component={TextField}
            placeholder="Canal de aquisição"
            label="Canal de aquisição"
            variant="outlined"
          />
          <Field
            className={classes.grid}
            name="temperature_2"
            component={TextField}
            placeholder="Temperatura 2 (mV)"
            label="Temperatura 2 (mV)"
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
            name="temperature_2_C"
            component={TextField}
            placeholder="Temperatura 2 (°C)"
            label="Temperatura 2 (°C)"
            variant="outlined"
          />
        </div>
      );

    return null;
  }

  render() {
    return (
      <div>
        {this.renderFields1()}
        {this.renderFields2()}
      </div>
    );
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
