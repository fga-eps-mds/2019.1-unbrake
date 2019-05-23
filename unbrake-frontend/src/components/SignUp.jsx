import React from "react";
import { connect } from "react-redux";
import { reduxForm, SubmissionError } from "redux-form";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import history from "../utils/history";
import { API_URL_GRAPHQL } from "../utils/Constants";
import { messageSistem } from "../actions/NotificationActions";
import NotificationContainer from "./Notification";

import FieldComponent from "./FieldComponent";
import { renderSubmit, propTypes, authStyles } from "./AuthForm";
import paperAuth from "../styles/AuthStyle";

const styles = authStyles;

export const validate = values => {
  const errors = {};
  const requiredFields = ["username", "password", "confirmPassword"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Obrigatório";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Não confere";
    }
  });
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Email inválido";
  }
  return errors;
};

export const submit = async (sendMessage, values) => {
  return fetch(
    `${API_URL_GRAPHQL}?query=mutation{createUser(password: "${
      values.password
    }",
     username: "${values.username}",
     isSuperuser: false){user{id}}}`,
    {
      method: "POST"
    }
  )
    .then(response => {
      return response.json();
    })
    .then(parsedData => {
      if (parsedData.errors !== undefined) {
        if (
          parsedData.errors[0].message ===
          "UNIQUE constraint failed: auth_user.username"
        ) {
          throw new SubmissionError({
            username: "O usuário já está em uso",
            _error: "Login failed!"
          });
        }
      } else if (parsedData.data.createUser.user !== null) {
        sendMessage({
          message: "Usuário cadastrado com sucesso",
          variante: "success",
          condition: true
        });
        history.push("/");
      }
    });
};
const signUpPaper = params => {
  return (
    <Paper className={params.classes.paper} elevation={10}>
      <Typography
        variant="h4"
        color="secondary"
        className={params.classes.grid}
      >
        Registre-se
      </Typography>
      <form
        onSubmit={params.handleSubmit(submit.bind(this, params.sendMessage))}
      >
        <FieldComponent
          data={{ name: "username", label: "Usuario", type: "text" }}
        />
        <FieldComponent
          data={{ name: "email", label: "Email", type: "email" }}
        />
        <FieldComponent
          data={{ name: "password", label: "Senha", type: "password" }}
        />
        <FieldComponent
          data={{
            name: "confirmPassword",
            label: "Confirme a Senha",
            type: "password"
          }}
        />
        {renderSubmit("Registrar", params.classes, params.submitting)}
      </form>
    </Paper>
  );
};

class SignUp extends React.PureComponent {
  render() {
    const params = this.props;
    return (
      <div style={paperAuth}>
        {signUpPaper(params)}
        <NotificationContainer />
      </div>
    );
  }
}

SignUp.propTypes = propTypes;
const SignUpForm = reduxForm({
  form: "signup",
  validate
})(SignUp);

const mapStateToProps = state => ({
  message: state.notificationReducer.message,
  variante: state.notificationReducer.variante
});

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignUpForm));
