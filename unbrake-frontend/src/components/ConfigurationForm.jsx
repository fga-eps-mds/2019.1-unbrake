import React from "react";
import PropTypes from "prop-types";
import { initialize, Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, Button, FormControlLabel, Grid } from "@material-ui/core";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";

const limits = (value, allValues) => {
  return parseInt(allValues.LSL, 10) >= parseInt(allValues.USL, 10)
    ? "Valores Inválidos"
    : undefined;
};

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  grid: {
    padding: "px"
  },
  gridButton: {
    paddingLeft: theme.spacing.unit + theme.spacing.unit
  }
});

let nameField;
let labelField;

const rowsFields = (classes, vector, handleChange) => {
  const fields = vector.map(value => {
    switch (value.name) {
      case "NOS":
        nameField = "NOS";
        labelField = "Numero de Snubs";
        break;
      case "USL":
        nameField = "USL";
        labelField = "Limite Superior (km/h)";
        break;
      case "UWT":
        nameField = "UWT";
        labelField = "Tempo de Espera (s)";
        break;
      case "TBS":
        nameField = "TBS";
        labelField = "Tempo entre ciclos";
        break;
      case "LSL":
        nameField = "LSL";
        labelField = "Limite inferior (km/h)";
        break;
      case "LWT":
        nameField = "LWT";
        labelField = "Tempo de espera (s)";
        break;
      default:
        break;
    }
    return (
      <Grid item xs={3} className={classes.grid}>
        <Field
          id={nameField}
          component={TextField}
          label={labelField}
          value={value.value}
          onChange={handleChange(nameField)}
          type="number"
          name={nameField}
          validate={limits}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </Grid>
    );
  });
  return fields;
};

const fieldsConfigurations = (classes, vector, handleChange) => {
  const rows = vector.map(value => {
    return (
      <Grid container item xs={24} alignItems="center" justify="center">
        {rowsFields(classes, value, handleChange)}
      </Grid>
    );
  });
  return rows;
};

const checkBox = (classes, type) => {
  let label;
  switch (type.name) {
    case "TMO":
      label = "Inibe Desligamento do Motor";
      break;
    case "TAO":
      label = "Ativa saida auxiliar (AUX1)";
      break;
    default:
      break;
  }
  return (
    <Grid item xs={3} className={classes.gridButton} justify="center">
      <FormControlLabel
        control={
          <Field component={Checkbox} name={type.name} value={type.value} />
        }
        label={label}
      />
    </Grid>
  );
};

const Buttons = (classes, submitting) => {
  return (
    <Grid item xs={3} className={classes.grid} justify="right">
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        disabled={submitting}
      >
        Cadastrar
      </Button>
    </Grid>
  );
};

const CommunGrid = (classes, type, handleChange) => {
  let label;
  switch (type.name) {
    case "TAS":
      label = "Temperatura(˚C)(AUX1)";
      break;
    case "TAT":
      label = "Tempo (s)(AUX1)";
      break;
    default:
      break;
  }
  return (
    <Grid item xs={6} className={classes.grid}>
      <Field
        id={type.name}
        component={TextField}
        label={label}
        value={type.value}
        onChange={handleChange(type.name)}
        type="number"
        name={type.name}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    </Grid>
  );
};

const otherField = (classes, vector, handleChange) => {
  const fields = vector.map(value => {
    return (
      <Grid container item xs={12} alignItems="center" justify="center">
        {checkBox(classes, value[0])}
        {CommunGrid(classes, value[1], handleChange)}
      </Grid>
    );
  });
  return fields;
};

async function submit(values, state) {
  const url = `${API_URL_GRAPHQL}?query=mutation{createConfig(number:${
    state.NOS
  },timeBetweenCycles:${state.TBS},upperLimit:${state.USL},inferiorLimit:${
    state.LSL
  },upperTime:${state.UWT},inferiorTime:${state.LWT},disableShutdown:${
    state.TMO
  },enableOutput:${state.TAO},temperature:${state.TAS},time:${
    state.TAT
  }){config{number, timeBetweenCycles,upperLimit,inferiorLimit}}}`;

  const method = "POST";

  const response = await Request(url, method);

  return response;
}

class ConfigurationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration: {
        NOS: "",
        USL: "",
        UWT: "",
        LSL: "",
        LWT: "",
        TBS: "",
        TAS: "",
        TAT: "",
        TMO: false,
        TAO: ""
      }
    };
    this.handleChange = name => event => {
      const configuration = {};
      configuration[name] = event.target.value;
      this.setState(prevState => ({
        configuration: { ...prevState.configuration, ...configuration }
      }));
    };
    this.checkHandleChange = name => event => {
      this.setState({ configuration: { [name]: event.target.checked } });
    };
  }

  shouldComponentUpdate(nextProps) {
    const { configuration } = this.props;

    if (configuration !== nextProps.configuration) {
      const rightConfig = Object.assign({}, nextProps.configuration);
      rightConfig.CONFIG_ENSAIO.TMO =
        nextProps.configuration.CONFIG_ENSAIO.TMO !== "FALSE";

      const { dispatch } = this.props;
      dispatch(initialize("configuration", rightConfig.CONFIG_ENSAIO));
      this.setState({ configuration: rightConfig.CONFIG_ENSAIO });
      return true;
    }
    return false;
  }

  render() {
    const { classes, handleSubmit, submitting } = this.props;
    const { configuration } = this.state;
    const { TAS, TAT, TMO, TAO, UWT, NOS, LSL, USL, TBS, LWT } = configuration;
    const rowOne = [
      { name: "NOS", value: NOS },
      { name: "USL", value: USL },
      { name: "UWT", value: UWT }
    ];
    const rowTwo = [
      { name: "TBS", value: TBS },
      { name: "LSL", value: LSL },
      { name: "LWT", value: LWT }
    ];
    const rows = [rowOne, rowTwo];
    const oneFields = [
      { name: "TMO", value: TMO },
      { name: "TAS", value: TAS }
    ];
    const twoFields = [
      { name: "TAO", value: TAO },
      { name: "TAT", value: TAT }
    ];
    const othersFilds = [oneFields, twoFields];

    return (
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={handleSubmit(values => {
          submit(values, this.state);
        })}
      >
        {fieldsConfigurations(classes, rows, this.handleChange)}
        {otherField(classes, othersFilds, this.handleChange)}
        <Grid container item xs={12} alignItems="center" justify="center">
          {Buttons(classes, submitting)}
        </Grid>
      </form>
    );
  }
}

ConfigurationForm.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  configuration: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

const Configuration = reduxForm({
  form: "configuration"
})(ConfigurationForm);

export default withStyles(styles)(Configuration);