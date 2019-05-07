import React from "react";
import { reduxForm } from "redux-form";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Cookies from "universal-cookie";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import history from "../utils/history";
import FieldComponent from "./FieldComponent";

const padding = 10;
const baseUrl = API_URL_GRAPHQL;
const cookie = new Cookies();

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
          href="/signUp"
          fullWidth
        >
          Cadastrar
        </Button>
      </Grid>
    </Grid>
  );
};

async function submit(values) {
  const url = `${baseUrl}?query=mutation{tokenAuth(username:"${
    values.username
  }",password:"${values.password}"){token}}`;

  const method = "POST";

  const parsedData = await Request(url, method);

  if (parsedData.data.tokenAuth !== null) {
    cookie.set("token", parsedData.data.tokenAuth.token, {
      path: "/"
      // httpOnly: false
    });
    history.push("/");
  } else {
    // block login
  }
}
const loginPaper = (classes, handleSubmit, submitting) => {
  return (
    <Paper className={classes.paper} elevation={10}>
      <Typography variant="h4" color="secondary" className={classes.grid}>
        Bem vindo!
      </Typography>
      <form onSubmit={handleSubmit(submit.bind(this))}>
        <FieldComponent
          data={{ name: "username", label: "Usuario", type: "text" }}
          classes={classes}
        />
        <FieldComponent
          data={{ name: "password", label: "Senha", type: "password" }}
        />
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
        spacing={16}
      >
        {loginPaper(classes, handleSubmit, submitting)}
      </Grid>
    );
  }
}

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
