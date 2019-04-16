import React from "react";
import "./App.css";
import { Route, BrowserRouter } from "react-router-dom";

// import Login from "./components/Login";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

export default () => (
  <BrowserRouter>
    {/* <Route exact path="/" component={Login} /> */}
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
  </BrowserRouter>
);
