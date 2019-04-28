import React from "react";
import "./App.css";
import { Route, Router } from "react-router-dom";
import history from "./utils/history";

import Login from "./components/Login";
import SignUp from "./components/SignUp";

export default () => (
  <Router history={history}>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
  </Router>
);
