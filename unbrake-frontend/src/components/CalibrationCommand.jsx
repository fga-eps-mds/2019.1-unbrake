import React from "react";
import "../App.css";
import { Field, reduxForm } from "redux-form";
import { TextField, withStyles } from "@material-ui/core";
import CalibrationCheck from "./CalibrationTempCheck";
import RealTimeChart from "./RealTimeChart";

const styles = () => ({
  grid: {
    margin: "5px"
  },
  div: {
    marginTop: "5px",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center"
  }
});

const renderFields = (name, label) => (
  <div className={styles.div}>
    <Field
      style={{ margin: "5px" }}
      name={name}
      component={TextField}
      label={label}
      placeholder={label}
      variant="outlined"
    />
  </div>
);
const renderAllFields = (name, label, unidade) => (
  <div
    style={{
      flexDirection: "column",
      display: "flex",
      justifyContent: "space-evenly"
    }}
  >
    {renderFields(`${name}Chanel`, "Canal - comando")}
    {renderFields(`${name}`, `${label} ${unidade}`)}
    {renderFields(`${name}Max`, `${label} máxima ${unidade}`)}
    {renderFields(`${name}Cycle`, `${label} (Duty Cycle)`)}
    {renderFields(`${name}Command`, `${label} - comando (mV)`)}
  </div>
);
const CalibrationCommand = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <div style={{ marginTop: "6%", marginBottom: "2%" }}>
      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-evenly"
        }}
      >
        {renderAllFields("speed", "Velocidade", "(Km/h)")}
        {renderAllFields("pression", "Pressão", "(Bar)")}
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "space-evenly",
            marginLeft: "3%"
          }}
        >
          <CalibrationCheck graphicType="velocidade" checkID="1" />
          <CalibrationCheck graphicType="pressão" checkID="2" />
        </div>
      </div>
    </div>

    <div style={{ justifyContent: "center", display: "flex" }}>
      <RealTimeChart />
    </div>
  </div>
);

const CalibrationForm = reduxForm({
  form: "calibration"
})(CalibrationCommand);

export default withStyles(styles)(CalibrationForm);
