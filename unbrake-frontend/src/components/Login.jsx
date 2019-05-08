import React from "react";
import { reduxForm } from "redux-form";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Cookies from "universal-cookie";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import history from "../utils/history";
import FieldComponent from "./FieldComponent";
import { renderSubmit, propTypes, authStyles } from "./AuthForm";

const baseUrl = API_URL_GRAPHQL;
const cookie = new Cookies();

const styles = authStyles;

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
const loginPaper = (classes, handleSubmit, logging) => {
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
        {renderSubmit("Entrar", classes, logging)}
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
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          alignItems: "center",
          justifyContent: "center",
          display: "flex"
        }}
      >
        {loginPaper(classes, handleSubmit, submitting)}
      </div>
    );
  }
}

Login.propTypes = propTypes;
const LoginForm = reduxForm({
  form: "login",
  validate
})(Login);

export default withStyles(styles)(LoginForm);
