import React from "react";
import { reduxForm, SubmissionError } from "redux-form";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import history from "../utils/history";
import { API_URL_GRAPHQL } from "../utils/Constants";
import FieldComponent from "./FieldComponent";

const padding = 10;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * padding,
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "600px"
  },
  field: {
    paddingTop: theme.spacing.unit * padding,
    paddingBottom: theme.spacing.unit * padding
  },
  grid: {
    padding: "5px"
  }
});

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

const signUpButton = (classes, submitting) => {
  return (
    <Grid container item xs={12} alignItems="center" justify="center">
      <Grid item xs={3} className={classes.grid}>
        <Button
          color="secondary"
          fullWidth
          variant="contained"
          type="submit"
          disabled={submitting}
        >
          Registrar
        </Button>
      </Grid>
    </Grid>
  );
};

export const submit = values => {
  return fetch(
    `${API_URL_GRAPHQL}?query=mutation{createUser(password: "${
      values.password
    }",
     username: "${values.username}"){user{id}}}`,
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
        history.push("/login");
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
        {signUpButton(classes, submitting)}
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

SignUp.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};
const SignUpForm = reduxForm({
  form: "signup",
  validate
})(SignUp);

export default withStyles(styles)(SignUpForm);
