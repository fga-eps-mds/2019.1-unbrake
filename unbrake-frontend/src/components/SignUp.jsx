import React from "react";
import { reduxForm, SubmissionError } from "redux-form";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import history from "../utils/history";
import { API_URL_GRAPHQL } from "../utils/Constants";
import FieldComponent from "./FieldComponent";
import { renderSubmit, propTypes, authStyles } from "./AuthForm";

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
  return errors;
};

export const submit = values => {
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
        history.push("/");
      }
    });
};
const signUpPaper = (classes, handleSubmit, submitting) => {
  return (
    <Paper className={classes.paper} elevation={10}>
      <Typography variant="h4" color="secondary" className={classes.grid}>
        Registre-se
      </Typography>
      <form onSubmit={handleSubmit(submit)}>
        <FieldComponent
          data={{ name: "username", label: "Usuario", type: "text" }}
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
        {renderSubmit("Registrar", classes, submitting)}
      </form>
    </Paper>
  );
};

class SignUp extends React.PureComponent {
  render() {
    const { classes, handleSubmit, submitting } = this.props;
    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        container
        spacing={16}
      >
        {signUpPaper(classes, handleSubmit, submitting)}
      </Grid>
    );
  }
}

SignUp.propTypes = propTypes;
const SignUpForm = reduxForm({
  form: "signup",
  validate
})(SignUp);

export default withStyles(styles)(SignUpForm);
