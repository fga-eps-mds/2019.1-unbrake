import React from "react";
import { Field } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { FormControlLabel, Grid } from "@material-ui/core";

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

// type = {name:"", value:"", disable:false}
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
        label={label(type.name)}
      />
    </Grid>
  );
};

// type = {name:"", value:"", disable:false}
export const field = (type, classes, handleChange) => {
  return (
    <Grid item xs={12} container alignItems="center" justify="center">
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
