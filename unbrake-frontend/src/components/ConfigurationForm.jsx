import React from "react";
import PropTypes from "prop-types";
import { initialize, Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, Button, FormControlLabel, Grid } from "@material-ui/core";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import styles from "./Styles";

const limits = (value, allValues) => {
  return parseInt(allValues.LSL, 10) >= parseInt(allValues.USL, 10)
    ? "Valores Inválidos"
    : undefined;
};

const validate = values => {
  const errors = {};
  const requiredFields = [
    "TAS",
    "TAT",
    "UWT",
    "NOS",
    "LSL",
    "USL",
    "TBS",
    "LWT"
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Campo obrigatório";
    }
  });
  return errors;
};

let nameField;

const fieldsLabels = {
  NOS: "Numero de Snubs",
  USL: "Limite Superior (km/h)",
  UWT: "Tempo de Espera (s)",
  TBS: "Tempo entre ciclos",
  LSL: "Limite inferior (km/h)",
  LWT: "Tempo de espera (s)"
};

const rowsFields = (classes, vector, handleChange) => {
  const fields = vector.map(value => {
    switch (value.name) {
      case "NOS":
        nameField = "NOS";
        break;
      case "USL":
        nameField = "USL";
        break;
      case "UWT":
        nameField = "UWT";
        break;
      case "TBS":
        nameField = "TBS";
        break;
      case "LSL":
        nameField = "LSL";
        break;
      case "LWT":
        nameField = "LWT";
        break;
      default:
        break;
    }
    return (
      <Grid key={`row${nameField}`} item xs={3} className={classes.grid}>
        <Field
          id={nameField}
          component={TextField}
          label={fieldsLabels[nameField]}
          onChange={handleChange}
          type="number"
          name={nameField}
          validate={nameField === "USL" || nameField === "LSL" ? limits : []}
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
      <Grid
        key={`field${value[0].name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
      >
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
    <Grid container item xs={3} className={classes.gridButton} justify="center">
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
    <Grid container item xs={3} className={classes.grid}>
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
        onChange={handleChange}
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
      <Grid
        key={`other${value[1].name}`}
        container
        item
        xs={12}
        alignItems="center"
        justify="center"
      >
        {checkBox(classes, value[0])}
        {CommunGrid(classes, value[1], handleChange)}
      </Grid>
    );
  });
  return fields;
};

async function submit(values, state) {
  const { configuration } = state;
  const { TAS, TAT, TMO, TAO, UWT, NOS, LSL, USL, TBS, LWT } = configuration;
  const url = `${API_URL_GRAPHQL}?query=mutation{createConfig(name:"teste4",number:${NOS},timeBetweenCycles:${TBS},upperLimit:${USL},inferiorLimit:${LSL},upperTime:${UWT},inferiorTime:${LWT},disableShutdown:${TMO},enableOutput:${TAO},temperature:${TAS},time:${TAT}){config{number, timeBetweenCycles,upperLimit,inferiorLimit}}}`;

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
        TAO: false
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { configuration } = this.props;
    if (configuration !== nextProps.configuration) {
      const rightConfig = Object.assign({}, nextProps.configuration);
      rightConfig.CONFIG_ENSAIO.TMO =
        nextProps.configuration.CONFIG_ENSAIO.TMO !== "FALSE";
      rightConfig.CONFIG_ENSAIO.TAO =
        nextProps.configuration.CONFIG_ENSAIO.TAO !== "FALSE";

      const { dispatch } = this.props;
      dispatch(initialize("configuration", rightConfig.CONFIG_ENSAIO));
      this.setState({ configuration: rightConfig.CONFIG_ENSAIO });
      return true;
    }
    return false;
  }

  handleChange(event) {
    const configuration = {};
    const { name, value } = event.target;
    configuration[name] = value;
    this.setState(prevState => ({
      configuration: { ...prevState.configuration, ...configuration }
    }));
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
    const othersFields = [oneFields, twoFields];

    return (
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={handleSubmit(values => {
          submit(values, configuration);
        })}
      >
        {fieldsConfigurations(classes, rows, this.handleChange)}
        {otherField(classes, othersFields, this.handleChange)}
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
  configuration: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired
};

const Configuration = reduxForm({
  form: "configuration",
  validate
})(ConfigurationForm);

export default withStyles(styles)(Configuration);
