import React from "react";
import "./App.css";
import { Route, BrowserRouter } from "react-router-dom";

// import Login from "./components/Login";
import Login from "./components/Login";

export default () => (
  <BrowserRouter>
    {/* <Route exact path="/" component={Login} /> */}
    <Route path="/index" component={Login} />
  </BrowserRouter>
);
