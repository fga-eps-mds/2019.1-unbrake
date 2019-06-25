import React from "react";
import { Checkbox } from "redux-form-material-ui";
import { Field } from "redux-form";
import { FormControlLabel } from "@material-ui/core";

import OfflineBolt from "@material-ui/icons/OfflineBolt";
import OfflineBoltOutlined from "@material-ui/icons/OfflineBoltOutlined";
import ReportProblem from "@material-ui/icons/ReportProblem";
import ReportProblemOutlined from "@material-ui/icons/ReportProblemOutlined";
import WatchLaterOutlined from "@material-ui/icons/WatchLaterOutlined";
import WatchLater from "@material-ui/icons/WatchLater";
import BeachAccessOutlined from "@material-ui/icons/BeachAccessOutlined";
import BeachAccess from "@material-ui/icons/BeachAccess";

export const accelerateCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<OfflineBoltOutlined color="secondary" />}
          checkedIcon={<OfflineBolt style={{ color: "green" }} />}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  );
};

export const brakeCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<ReportProblemOutlined color="secondary" />}
          checkedIcon={<ReportProblem style={{ color: "red" }} />}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  );
};

export const cooldownCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<WatchLaterOutlined color="secondary" />}
          checkedIcon={<WatchLater style={{ color: "#ffd600" }} />}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  );
};

export const waterCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<BeachAccessOutlined color="secondary" />}
          checkedIcon={<BeachAccess style={{ color: "blue" }} />}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  );
};
