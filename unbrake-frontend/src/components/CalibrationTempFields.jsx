import React from "react";
import "../App.css";
import { Field } from "redux-form";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";

const FIRST_FIELD = "firstField";
const SECOND_FIELD = "secondField";

export class CalibrationFields extends React.Component {
  renderFields1() {
    const { field } = this.props;
    if (field === FIRST_FIELD)
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

    return null;
  }

  renderFields2() {
    const { field } = this.props;
    if (field === SECOND_FIELD)
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
            name="temperature_2"
            component={TextField}
            placeholder="Temperatura 2 (mV)"
            label="Temperatura 2 (mV)"
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
            name="temperature_2_C"
            component={TextField}
            placeholder="Temperatura 2 (°C)"
            label="Temperatura 2 (°C)"
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
  field: PropTypes.string
};
CalibrationFields.defaultProps = {
  field: ""
};

export default CalibrationFields;
