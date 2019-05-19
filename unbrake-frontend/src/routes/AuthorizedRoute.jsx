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

class AuthorizedRoute extends React.PureComponent {
  render() {
    const {
      superuser,
      permission,
      loadingVerifyingAuth,
      changeVerifyingAuth
    } = this.props;

    verifyToken().then(value => {
      changeVerifyingAuth(value);
    });
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
  changeVerifyingAuth: PropTypes.func
};

AuthorizedRoute.defaultProps = {
  superuser: false,
  permission: ""
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
