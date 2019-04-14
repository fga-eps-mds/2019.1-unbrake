import React from "react";
import "../App.css";
import { reduxForm } from "redux-form";
import CalibrationFields from "./CalibrationTempFields";
import CalibrationCheck from "./CalibrationTempCheck";

const MyForm = () => (
  <form>
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-evenly"
      }}
    >
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-evenly",
          flex: 2
        }}
      >
        <CalibrationFields field="firstField" />

        <CalibrationFields field="secondField" />
      </div>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-evenly",
          marginLeft: "3%",
          flex: 1
        }}
      >
        <CalibrationCheck checkID="FirstCheck" />
        <CalibrationCheck checkID="SecondCheck" />
      </div>
    </div>
  </form>
);

// Decorate with redux-form
const formExportation = reduxForm({
  form: "myForm"
})(MyForm);

export default formExportation;
