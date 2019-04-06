import React from "react";
import "../App.css";
import { Field } from "redux-form";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";

// import { TextField } from "redux-form-material-ui";

const FIRST_FIELD = "firstField";
// const SECCOND_FIELD = "secondField";

class CalibrationFields extends React.Component {
  renderFields1() {
    const { field } = this.props;
    if ({ field } === FIRST_FIELD)
      return (
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Field
            name="aquisition_canal"
            component={TextField}
            placeholder="Canal de aquisição"
            label="Canal de aquisição"
          />
          <Field
            name="temperature_1"
            component={TextField}
            placeholder="Temperatura 1 (mV)"
            label="Temperatura 1 (mV)"
          />
          <Field
            name="conversion_fator"
            component={TextField}
            placeholder="Fator de conversão"
            label="Fator de conversão"
          />
          <Field
            name="offset"
            component={TextField}
            placeholder="Offset"
            label="Offset"
          />
          <Field
            name="temperature_1_C"
            component={TextField}
            placeholder="Temperatura 1 (°C)"
            label="Temperatura 1 (°C)"
          />
        </div>
      );

    return this.renderFields2();
  }

  static renderFields2() {
    return (
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Field
          name="aquisition_canal"
          component={TextField}
          placeholder="Canal de aquisição"
          label="Canal de aquisição"
        />
        <Field
          name="temperature_1"
          component={TextField}
          placeholder="Temperatura 1 (mV)"
          label="Temperatura 1 (mV)"
        />
        <Field
          name="conversion_fator"
          component={TextField}
          placeholder="Fator de conversão"
          label="Fator de conversão"
        />
        <Field
          name="offset"
          component={TextField}
          placeholder="Offset"
          label="Offset"
        />
        <Field
          name="temperature_1_C"
          component={TextField}
          placeholder="Temperatura 1 (°C)"
          label="Temperatura 1 (°C)"
        />
      </div>
    );
  }

  render() {
    return <div>{this.renderFields1()}</div>;
  }
}

CalibrationFields.propTypes = {
  field: PropTypes.string
};
CalibrationFields.defaultProps = {
  field: ""
};

export default CalibrationFields;
