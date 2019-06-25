import React from "react";
import iniparser from "iniparser";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm, initialize } from "redux-form";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import ConfigurationForm from "./ConfigurationForm";
import styles from "./Styles";
import {
  defaultButton,
  selectConfiguration,
  createConfig,
  submitDefault,
  query,
  saveConfiguration,
  dialogName,
  renderUploadField,
  selectConfigurationDataBase
} from "./ConfigFunctions";
import { redirectPage } from "../actions/RedirectActions";
import NotificationContainer from "../components/Notification";
import { messageSistem } from "../actions/NotificationActions";
import { changeConfigTest } from "../actions/TestActions";

const positionVector = 1;
const invalidId = 0;

const nextButton = handleNext => {
  return (
    <Grid container justify="center" item alignItems="center" xs={3}>
      <Button onClick={handleNext} color="secondary" variant="contained">
        Próxima etapa
      </Button>
    </Grid>
  );
};

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration: {
        CONFIG_ENSAIO: {
          LSL: "",
          LWT: "",
          NOS: "",
          TAO: false,
          TAS: "",
          TAT: "",
          TBS: "",
          TMO: false,
          USL: "",
          UWT: ""
        },
        name: ""
      },
      isDefault: false,
      fileName: "Upload do arquivo de configuração",
      allConfiguration: "",
      open: false
    };

    this.handleUpDefault = this.handleUpDefault.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIsDefault = this.handleIsDefault.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    const { configId, sendMessage, dispatch } = this.props;

    const url = `${API_URL_GRAPHQL}?query=query{configNotDefault{id, name}}`;
    const method = "GET";
    Request(url, method).then(json => {
      const data = json.data.configNotDefault;
      if (data !== null) this.setState({ allConfiguration: data });
    });

    if (configId > invalidId)
      selectConfigurationDataBase(configId, sendMessage, dispatch);
  }

  componentDidUpdate(prevProps) {
    const { configId } = this.props;
    if (configId !== prevProps.configId) {
      return true;
    }
    return false;
  }

  handleNext() {
    const { redirect } = this.props;
    redirect({ url: "/calibration" });
  }

  handleClickSave(state) {
    const CONFIG_ENSAIO = state.configuration;
    const newConfig = { CONFIG_ENSAIO };
    this.setState({ configuration: newConfig });
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleIsDefault(event) {
    this.setState({ isDefault: event.target.checked });
  }

  handleSubmit() {
    const { configuration, name, isDefault } = this.state;
    const { sendMessage, redirect, changeConfig } = this.props;
    const dispatchs = { sendMessage, changeConfig };

    if (name === "" || name === undefined) {
      sendMessage({
        message: "O nome é obrigatório para cadastrar a configuração",
        variante: "error",
        condition: true
      });
      return;
    }

    if (isDefault) {
      if (submitDefault(configuration.CONFIG_ENSAIO, name, dispatchs))
        redirect({ url: "/calibration" });
    } else if (
      saveConfiguration(configuration.CONFIG_ENSAIO, name, dispatchs)
    ) {
      redirect({ url: "/calibration" });
    }
  }

  handleUpDefault() {
    const { sendMessage, changeConfig, dispatch } = this.props;
    const url = `${API_URL_GRAPHQL}?query=query{configDefault{${query}}}`;

    const method = "GET";

    const empty = 0;

    Request(url, method).then(response => {
      if (response.data.configDefault.length === empty) {
        sendMessage({
          message: "Configuração padrão não existe",
          variante: "error",
          condition: true
        });
        return;
      }
      sendMessage({
        message: "Configuração padrão escolhida com sucesso",
        variante: "success",
        condition: true
      });
      const position = response.data.configDefault.length - positionVector;
      const data = response.data.configDefault[position];
      changeConfig({ configId: data.id });
      const configurationDefault = createConfig(data);

      dispatch(initialize("configuration", configurationDefault.CONFIG_ENSAIO));
      this.setState({ configuration: configurationDefault });
    });
  }

  handleChange(event) {
    const { changeConfig, sendMessage, dispatch } = this.props;
    const { target } = event;

    if (target.name === "name") {
      this.setState({ [event.target.name]: event.target.value });
      return;
    }

    const idSelect = target.value === invalidId ? "" : target.value;

    changeConfig({ configId: idSelect });
    selectConfigurationDataBase(event.target.value, sendMessage, dispatch);
  }

  fileUpload(file, name) {
    const { sendMessage } = this.props;
    this.setState({ fileName: file.name });
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const scope = this;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);
      if (fileUpload.CONFIG_ENSAIO !== undefined)
        scope.setState({ configuration: fileUpload });
      else {
        sendMessage({
          message: "Aquivo não se encontra no padrão .ini para configuração",
          variante: "warning",
          condition: true
        });
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  uploadField(field) {
    const { classes } = this.props;
    const { fileName } = this.state;
    let archive;

    if (field === "calibration") archive = "Calibração";
    else archive = "Configuração";
    const names = { field, fileName, archive };
    return <div>{renderUploadField(classes, this.fileUpload, names)}</div>;
  }

  render() {
    const { classes, configId } = this.props;
    const {
      configuration,
      allConfiguration,
      open,
      name,
      isDefault
    } = this.state;
    const functions = {
      handleChange: this.handleChange,
      handleClose: this.handleClose,
      handleSubmit: this.handleSubmit,
      handleIsDefault: this.handleIsDefault
    };
    const configStates = [configId, allConfiguration];
    const dialogStates = {
      configuration: configuration.CONFIG_ENSAIO,
      open,
      name,
      isDefault
    };
    // changeReduxConfig(allConfiguration, dataBaseConfiguration);

    return (
      <Grid alignItems="center" container className={classes.configuration}>
        <div>
          <Grid container item justify="center">
            {this.uploadField("configuration")}
          </Grid>
          <Grid container justify="center" item alignItems="center" xs={12}>
            {selectConfiguration(this.handleChange, configStates, classes)}
            {defaultButton(this.handleUpDefault)}
            {nextButton(this.handleNext)}
          </Grid>
          <Grid container xs={12} item className={classes.form}>
            <ConfigurationForm
              configuration={configuration}
              handleClickSave={this.handleClickSave}
            />
          </Grid>
        </div>
        {dialogName(functions, dialogStates)}
        <NotificationContainer />
      </Grid>
    );
  }
}

Configuration.defaultProps = {
  configId: ""
};

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  sendMessage: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
  changeConfig: PropTypes.func.isRequired,
  configId: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendMessage: payload => dispatch(messageSistem(payload)),
  redirect: payload => dispatch(redirectPage(payload)),
  changeConfig: payload => dispatch(changeConfigTest(payload))
});

function mapStateToProps(state) {
  return {
    configId: state.testReducer.configId
  };
}

const ConfigurationForms = reduxForm({
  form: "configuration",
  destroyOnUnmount: false
})(Configuration);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ConfigurationForms));
