import React from "react";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Cookies from "universal-cookie";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import history from "../utils/history";
import { messageSistem } from "../actions/NotificationActions";
import NotificationContainer from "./Notification";
import FieldComponent from "./FieldComponent";
import { renderSubmit, propTypes, authStyles } from "./AuthForm";
import paperAuth from "../styles/AuthStyle";

const baseUrl = API_URL_GRAPHQL;
const cookie = new Cookies();

const styles = authStyles;

const validate = values => {
  const errors = {};
  const requiredFields = ["username", "password"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Campo obrigatório";
    }
  });
  return errors;
};

async function submit(sendMessage, values) {
  const url = `${baseUrl}?query=mutation{tokenAuth(username:"${
    values.username
  }",password:"${values.password}"){token}}`;

  const parsedData = await Request(url, "POST");
  if (parsedData.data.tokenAuth !== null) {
    cookie.set("token", parsedData.data.tokenAuth.token, {
      path: "/",
      maxAge: 86400
      // httpOnly: false
    });
    const urlRetrieveUser = `${baseUrl}?query={users{username, isSuperuser}}`;
    const methodRetrieve = "POST";
    const userVerification = await Request(urlRetrieveUser, methodRetrieve);
    userVerification.data.users.map(value => {
      if (value.username === values.username) {
        localStorage.setItem("isSuperuser", value.isSuperuser);
        localStorage.setItem("autenticated", "true");
        return null;
      }
      return null;
    });
    history.push("/");
  } else {
    sendMessage({
      message: "Usuário ou senha incorreto",
      variante: "error",
      condition: true
    });
  }
}
const loginPaper = parameters => {
  return (
    <Paper className={parameters.classes.paper} elevation={10}>
      <Typography
        variant="h4"
        color="secondary"
        className={parameters.classes.grid}
      >
        Bem vindo!
      </Typography>
      <form
        onSubmit={parameters.handleSubmit(
          submit.bind(this, parameters.sendMessage)
        )}
      >
        <FieldComponent
          data={{ name: "username", label: "Usuario", type: "text" }}
          classes={parameters.classes}
        />
        <FieldComponent
          data={{ name: "password", label: "Senha", type: "password" }}
        />
        {renderSubmit("Entrar", parameters.classes, parameters.submitting)}

        <div>
          <a href="./"> Esqueci minha senha</a>
        </div>
      </form>
    </Paper>
  );
};

class Login extends React.PureComponent {
  render() {
    const { classes, handleSubmit, submitting, sendMessage } = this.props;
    const parameters = { classes, handleSubmit, submitting, sendMessage };

    return (
      <div style={paperAuth}>
        {loginPaper(parameters)}
        <NotificationContainer />
      </div>
    );
  }
}

Login.propTypes = propTypes;

Login.defaultProps = {
  sendMessage: () => {}
};
const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload))
});

const LoginForm = reduxForm({
  form: "login",
  validate
})(Login);

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(LoginForm));
