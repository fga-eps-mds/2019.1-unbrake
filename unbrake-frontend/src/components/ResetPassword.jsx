import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Cookies from "universal-cookie";
// import history from "../utils/history";
import { withRouter } from "react-router-dom";
import { API_URL_GRAPHQL } from "../utils/Constants";
import { messageSistem } from "../actions/NotificationActions";
import { redirectPage } from "../actions/RedirectActions";

import FieldComponent from "./FieldComponent";
import { renderSubmit, propTypes, authStyles } from "./AuthForm";
import paperAuth from "../styles/AuthStyle";

import Request from "../utils/Request";

const minCaracters = 8;

const cookies = new Cookies();
const styles = authStyles;

export const validate = values => {
  const errors = {};
  if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "As senhas não são iguais";
  }
  return errors;
};

export const minLength = min => value =>
  value && value.length < min
    ? `Deve ter ${min} caracteres ou mais`
    : undefined;

export const required = value =>
  value || typeof value === "number" ? undefined : "Obrigatório";

export const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Endereço de email inválido"
    : undefined;

export const submit = async (sendMessage, redirect, values) => {
  const urlUsername = `${API_URL_GRAPHQL}?query=mutation{verifyToken(token: "${cookies.get(
    "token"
  )}"){payload}}`;
  const responseUsername = await Request(urlUsername, "POST");
  const user = responseUsername.data.verifyToken.payload.username;

  const url = `${API_URL_GRAPHQL}?query=mutation{updatePassword(username:"${user}", oldPassword:"${
    values.oldPassword
  }", newPassword:"${values.newPassword}"){user{username}, error}}`;

  const response = await Request(url, "POST");

  if (response.data.updatePassword.user !== null) {
    if (response.data.updatePassword.user.username === user) {
      sendMessage({
        message: "Senha alterada com sucesso",
        variante: "success",
        condition: true
      });
      redirect({ url: "/" });
    }
  } else if (response.data.updatePassword.error === "Wrong password") {
    sendMessage({
      message: "Senha atual incorreta",
      variante: "error",
      condition: true
    });
  }
  // else if (response.data.updatePassword.erro === "User no found")
};

const signUpPaper = params => {
  return (
    <Paper className={params.classes.paper} elevation={10}>
      <Typography
        variant="h4"
        color="secondary"
        className={params.classes.grid}
      >
        Redefinir senha
      </Typography>
      <form
        onSubmit={params.handleSubmit(
          submit.bind(this, params.sendMessage, params.redirect)
        )}
      >
        <FieldComponent
          data={{
            name: "oldPassword",
            label: "Senha atual",
            type: "password",
            validate: required
          }}
        />
        <FieldComponent
          data={{
            name: "newPassword",
            label: "Nova senha",
            type: "password",
            validate: [required, minLength(minCaracters)]
          }}
        />
        <FieldComponent
          data={{
            name: "confirmPassword",
            label: "Confirme a Senha",
            type: "password",
            validate: required
          }}
        />
        {renderSubmit("Registrar", params.classes, params.submitting)}
      </form>
    </Paper>
  );
};

class ResetPassword extends React.PureComponent {
  render() {
    const params = this.props;
    return (
      <div style={paperAuth}>
        {signUpPaper(params)}
        {/* <NotificationContainer /> */}
      </div>
    );
  }
}

ResetPassword.propTypes = propTypes;
const ResetPasswordForm = reduxForm({
  form: "reset",
  validate
})(ResetPassword);

const mapStateToProps = state => ({
  message: state.notificationReducer.message,
  variante: state.notificationReducer.variante
});

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload)),
  redirect: payload => dispatch(redirectPage(payload))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ResetPasswordForm))
);
