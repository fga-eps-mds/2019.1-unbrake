import React from "react";
import "./App.css";
import { Route, BrowserRouter } from "react-router-dom";

// import Login from "./components/Login";
import Index from "./components/Index";
import Configuration from "./components/Configuration";
import Calibration from "./components/Calibration";
import Test from "./components/Test";
import Analysis from "./components/Analysis";

export default () => (
  <BrowserRouter>
    {/* <Route exact path="/" component={Login} /> */}
    <Route path="/Index" component={Index} />
  </BrowserRouter>
);
