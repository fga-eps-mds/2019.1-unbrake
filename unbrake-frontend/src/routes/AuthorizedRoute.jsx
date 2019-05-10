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
      dispatch
    } = this.props;

    verifyToken().then(value => {
      dispatch(verifyingAuth(value));
    });

    if (
      isSuperuser(superuser, loadingVerifyingAuth) ||
      hasPermission(permission, loadingVerifyingAuth)
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
  dispatch: PropTypes.func.isRequired
};

AuthorizedRoute.defaultProps = {
  superuser: false,
  permission: "",
  loadingVerifyingAuth: false
};

const mapStateToProps = state => ({
  loadingVerifyingAuth: state.authReducer.loadingVerifyingAuth
});

export default connect(mapStateToProps)(AuthorizedRoute);
