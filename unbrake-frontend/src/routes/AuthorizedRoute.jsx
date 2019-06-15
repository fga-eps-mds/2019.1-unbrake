import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import { connect } from "react-redux";

import {
  isSuperuser,
  isAuthenticated,
  hasPermission,
  verifyToken
} from "../auth/Auth";
import NotAuthorizedRoute from "./NotAuthorizedRoute";
import { verifyingAuth } from "../actions/AuthActions";

const verifyLoginPath = props => {
  if (localStorage.getItem("autenticated") !== "true")
    return <Route {...props} />;
  return <Redirect to="/" />;
};
class AuthorizedRoute extends React.PureComponent {
  render() {
    const {
      permission,
      loadingVerifyingAuth,
      changeVerifyingAuth,
      superuser,
      path
    } = this.props;

    verifyToken().then(value => {
      changeVerifyingAuth(value);
    });
    isAuthenticated();
    if (path === "/login") {
      return verifyLoginPath(this.props);
    }

    if (
      isSuperuser(superuser, localStorage.getItem("autenticated") === "true") ||
      hasPermission(permission, localStorage.getItem("autenticated") === "true")
    ) {
      return <Route {...this.props} />;
    }
    if (isAuthenticated(loadingVerifyingAuth)) {
      return <NotAuthorizedRoute />;
    }
    return <Redirect to="/login" />;
  }
}

AuthorizedRoute.propTypes = {
  superuser: PropTypes.bool,
  permission: PropTypes.string,
  loadingVerifyingAuth: PropTypes.bool,
  changeVerifyingAuth: PropTypes.func,
  path: PropTypes.string
};

AuthorizedRoute.defaultProps = {
  superuser: false,
  permission: "",
  path: ""
};
const mapDispatchToProps = dispatch => ({
  changeVerifyingAuth: value => dispatch(verifyingAuth(value))
});

const mapStateToProps = state => ({
  loadingVerifyingAuth: state.authReducer.loadingVerifyingAuth
});

AuthorizedRoute.defaultProps = {
  loadingVerifyingAuth: false,
  changeVerifyingAuth: () => {}
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizedRoute);
