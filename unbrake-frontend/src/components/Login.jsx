import React from "react";
import { Field, reduxForm } from "redux-form";
import { TextField } from "redux-form-material-ui";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

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

const validate = values => {
  const errors = {};
  const requiredFields = ["username", "password"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
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

const loginButtons = (classes, submitting) => {
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
          Entrar
        </Button>
      </Grid>
      <Grid item xs={3} className={classes.grid}>
        <Button
          color="secondary"
          variant="contained"
          disabled={submitting}
          fullWidth
        >
          Cadastrar
        </Button>
      </Grid>
    </Grid>
  );
};

const submit = () => {
  return "Usuário logado";
};
const loginPaper = (classes, handleSubmit, submitting) => {
  return (
    <Paper className={classes.paper}>
      <h2 styles={{ color: "black" }}>Bem vindo!</h2>
      <form onSubmit={handleSubmit(submit.bind(this))}>
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
        {loginButtons(classes, submitting)}
        <div>
          <a href="./"> Esqueci minha senha</a>
        </div>
      </form>
    </Paper>
  );
};

class Login extends React.PureComponent {
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
        {loginPaper(classes, handleSubmit, submitting)}
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

Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};
const LoginForm = reduxForm({
  form: "login",
  validate
})(Login);

export default withStyles(styles)(LoginForm);
