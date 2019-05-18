import React from "react";
import "../../App.css";
import RealTimeChart from "../RealTimeChart";
import MyForm from "./CalibrationTempForm";
import CalibrationUpload from "./CalibrationUpload";

const Calibration = () => (
  <div className="App">
    <div style={{ marginTop: "6%", marginBottom: "2%" }}>
      <CalibrationUpload />
    </div>

    <div style={{ justifyContent: "center", display: "flex" }}>
      <RealTimeChart />
    </div>
  </div>
);

export default Calibration;
