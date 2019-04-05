import React from "react";
import "../App.css";
import { reduxForm, Field } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
/*
 * import {
 *   Checkbox,
 *   Select,
 *   TextField,
 *   Switch,
 *   FormControlLabel,
 * } from 'redux-form-material-ui'
 */

import { Checkbox, TextField, Select } from "redux-form-material-ui";

const MyForm = () => (
  <form>
    <Field name="username" component={TextField} placeholder="Street" />
    <Field name="username" component={Checkbox} placeholder="Street" />

    <Field name="plan" component={Select} placeholder="Select a plan">
      <MenuItem value="monthly">Monthly</MenuItem>
      <MenuItem value="yearly">Yearly</MenuItem>
      <MenuItem value="lifetime">Lifetime</MenuItem>
    </Field>

    {/* <FormControl label="Agree to terms?" />

            <FormControl control={<Field name="receiveEmails" component={Switch} /> } label="Please spam me!" /> */}
    {/* <Field name="bestFramework" component={RadioGroup} >
            <Radio value="react" label="React"/>
            <Radio value="angular" label="Angular"/>
            <Radio value="ember" label="Ember"/>
        </Field> */}
  </form>
);

// Decorate with redux-form
const formExportation = reduxForm({
  form: "myForm"
})(MyForm);

export default formExportation;
