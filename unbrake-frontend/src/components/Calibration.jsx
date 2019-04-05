import React from "react";
import "../App.css";
import RealTimeChart from "./RealTimeChart";
import MyForm from "./CalibrationTempForm";

const Calibration = () => (
  <div className="App">
    <RealTimeChart />
    <MyForm />
  </div>
);

export default Calibration;
