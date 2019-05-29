import React from "react";
import { Field } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { FormControlLabel, Grid } from "@material-ui/core";

// type = {name:"", value:"", label: "", disable:false}
export const checkbox = (type, handleChange) => {
  return (
    <Grid item xs={12} container alignItems="center" justify="center">
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
        label={type.label}
      />
    </Grid>
  );
};

// type = {name:"", value:"", label: "", disable:false}
export const field = (type, classes, handleChange) => {
  return (
    <Grid item xs={12} container alignItems="center" justify="center">
      <Field
        id={type.name}
        component={TextField}
        label={type.label}
        value={type.value}
        onChange={handleChange}
        disabled={type.disable}
        type="number"
        name={type.name}
        className={classes.textField}
        margin="normal"
        variant="outlined"
        style={{ width: "230px" }}
      />
    </Grid>
  );
};
