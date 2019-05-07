import React from "react";
import { Field } from "redux-form";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "redux-form-material-ui";
import PropTypes from "prop-types";

const padding = 10;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * padding,
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "600px"
  },
  field: {
    paddingTop: theme.spacing.unit * padding,
    paddingBottom: theme.spacing.unit * padding
  },
  grid: {
    padding: "5px"
  }
});

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <TextField
      label={label}
      placehoder={label}
      error={error && touched}
      type={type}
      variant="outlined"
      fullWidth
      helperText={touched && error}
      {...input}
    />
  </div>
);

const FieldComponent = props => {
  const { classes, data } = props;
  return (
    <Grid item xs={12} sm={12} className={classes.grid}>
      <Field
        name={data.name}
        type={data.type}
        component={renderField}
        label={data.label}
        variant="outlined"
        className={classes.field}
      />
    </Grid>
  );
};

FieldComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.string).isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

renderField.propTypes = {
  input: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  ).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.string])
  ).isRequired
};

export default withStyles(styles)(FieldComponent);
