import React from "react";
import "../../App.css";
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
  renderFields(name, label) {
    const { classes } = this.props;
    return (
      <div className={classes.div}>
        <Field
          className={classes.grid}
          name={name}
          component={TextField}
          label={label}
          placeholder={label}
          variant="outlined"
        />
      </div>
    );
  }
// colocar handleChange
  render() {
    const { field } = this.props;
    return (
      <div>
        {this.renderFields("acquisition_chanel", "Canal de aquisição")}
        {this.renderFields(`temperature_${field}`, `Temperatura ${field} (mV)`)}
        {this.renderFields("conversion_fator", "Fator de conversão")}
        {this.renderFields("offset", "Offset")}
        {this.renderFields(
          `temperature_${field}_C`,
          `Temperatura ${field} (°C)`
        )}
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
