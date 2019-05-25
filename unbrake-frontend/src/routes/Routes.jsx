import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "../utils/history";
import { NotFoundRoute, AuthorizedRoute } from "./RouteComponents";

import Login from "../components/Login";
import SideBarMenu from "../components/SideBarMenu";
import SignUp from "../components/SignUp";
import CalibrationCommand from "../components/CalibrationCommand";

export default () => (
  <Router history={history}>
    <Switch>
      <AuthorizedRoute
        permission="allow_any"
        exact
        path="/(|configuration|calibration|analysis|test|vibration|force)"
        component={SideBarMenu}
      />
      <Route exact path="/login" component={Login} />
      <Route exact path="/command" component={CalibrationCommand} />
      <AuthorizedRoute
        superuser={localStorage.getItem("isSuperuser") === "true"}
        exact
        path="/signup"
        component={SignUp}
      />
      <Route component={NotFoundRoute} />
    </Switch>
  </Router>
);
