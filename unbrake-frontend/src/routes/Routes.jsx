import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "../utils/history";
import { NotFoundRoute, AuthorizedRoute } from "./RouteComponents";

import Login from "../components/Login";
import SideBarMenu from "../components/SideBarMenu";
import SignUp from "../components/SignUp";

export default () => (
  <Router history={history}>
    <Switch>
      <AuthorizedRoute
        permission="allow_any"
        exact
        path="/"
        component={SideBarMenu}
      />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route component={NotFoundRoute} />
    </Switch>
  </Router>
);
