import React from "react";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { TextField } from "redux-form-material-ui";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const padding = 10;
const baseUrl = "http://localhost:8000/graphql";

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

const validate = values => {
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

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <TextField
      label={label}
      placehoder={label}
      error={error && touched}
      type={type}
      variant="outlined"
      fullWidth
      helperText={touched && error}
      {...input}
    />
  </div>
);

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

const submit = values => {
  return fetch(
    `${baseUrl}?query=mutation{createUser(password: "${values.password}",
     username: "${values.username}"){user{id}}}`,
    {
      method: "POST"
    }
  )
    .then(response => {
      return response.json();
    })
    .then(parsedData => {
      if (
        parsedData.errors[0].message ===
        "UNIQUE constraint failed: auth_user.username"
      ) {
        throw new SubmissionError({
          username: "O usuário já está em uso",
          _error: "Login failed!"
        });
      }
    });
};
const signUpPaper = (classes, handleSubmit, submitting) => {
  return (
    <Paper className={classes.paper}>
      <h2 styles={{ color: "black" }}>Registre-se!</h2>
      <form onSubmit={handleSubmit(submit)}>
        <Grid className={classes.grid}>
          <Field
            name="username"
            type="text"
            component={renderField}
            label="Usuário"
            variant="outlined"
            fullWidth
            className={classes.field}
          />
        </Grid>
        <Grid item xs={12} sm={12} className={classes.grid}>
          <Field
            name="password"
            type="password"
            component={renderField}
            label="Senha"
            variant="outlined"
            className={classes.field}
          />
        </Grid>
        <Grid item xs={12} sm={12} className={classes.grid}>
          <Field
            name="confirmPassword"
            type="password"
            component={renderField}
            label="Confirme a Senha"
            variant="outlined"
            className={classes.field}
          />
        </Grid>
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
        spacing={12}
      >
        {signUpPaper(classes, handleSubmit, submitting)}
      </Grid>
    );
  }
}

renderField.propTypes = {
  input: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.string])
  ).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.string])
  ).isRequired
};

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
