import React from "react";
import PropTypes from "prop-types";
import { initialize, Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, Button, FormControlLabel, Grid } from "@material-ui/core";
import Request from "../utils/Request";

const baseUrl = "http://localhost:8000/graphql";

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

const caseNOS = 0;
const caseUSL = 1;
const caseUWT = 2;

const caseTBS = 0;
const caseLSL = 1;
const caseLWT = 2;

const rowOne = (classes, vector, handleChange) => {
  const grids = vector.map((value, index) => {
    let name;
    let label;
    switch (index) {
      case caseNOS:
        name = "NOS";
        label = "Numero de Snubs";
        break;
      case caseUSL:
        name = "USL";
        label = "Limite Superior (km/h)";
        break;
      case caseUWT:
        name = "UWT";
        label = "Tempo de Espera (s)";
        break;
      default:
        break;
    }
    return (
      <Grid item xs={3} className={classes.grid}>
        <Field
          id={name}
          component={TextField}
          label={label}
          value={value}
          onChange={handleChange(name)}
          type="number"
          name={name}
          validate={limits}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </Grid>
    );
  });
  return grids;
};

const rowTwo = (classes, vector, handleChange) => {
  const grids = vector.map((value, index) => {
    let name;
    let label;
    switch (index) {
      case caseTBS:
        name = "TBS";
        label = "Tempo entre ciclos";
        break;
      case caseLSL:
        name = "LSL";
        label = "Limite inferior (km/h)";
        break;
      case caseLWT:
        name = "LWT";
        label = "Tempo de espera (s)";
        break;
      default:
        break;
    }
    return (
      <Grid item xs={3} className={classes.grid}>
        <Field
          id={name}
          component={TextField}
          label={label}
          value={value}
          onChange={handleChange(name)}
          type="number"
          name={name}
          validate={limits}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </Grid>
    );
  });
  return grids;
};

const checkBox = (classes, type) => {
  let label;
  switch (type[1]) {
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
        control={<Field component={Checkbox} name={type[1]} value={type[0]} />}
        label={label}
      />
    </Grid>
  );
};

const Buttons = (classes, submitting) => {
  return (
    <Grid item xs={3} className={classes.grid} justify="right">
      <Button color="secondary" variant="contained" disabled={submitting}>
        Cadastrar
      </Button>
    </Grid>
  );
};

const CommunGrid = (classes, type, handleChange) => {
  let label;
  switch (type[1]) {
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
        id={type[1]}
        component={TextField}
        label={label}
        value={type[0]}
        onChange={handleChange(type[1])}
        type="number"
        name={type[1]}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    </Grid>
  );
};

async function submit(values, state) {
  const url = `${baseUrl}?query=mutation{createConfig(number:${
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
    const vectorOne = [NOS, USL, UWT];
    const vectorTwo = [TBS, LSL, LWT];
    const dictionary = {
      powerMotor: [TMO, "TMO"],
      exitAux: [TAO, "TAO"],
      temp: [TAS, "TAS"],
      time: [TAT, "TAT"]
    };

    return (
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={handleSubmit(values => {
          submit(values, this.state);
        })}
      >
        <Grid container item xs={24} alignItems="center" justify="center">
          {rowOne(classes, vectorOne, this.handleChange)}
        </Grid>
        <Grid container item xs={24} alignItems="center" justify="center">
          {rowTwo(classes, vectorTwo, this.handleChange)}
        </Grid>
        <Grid container item xs={12} alignItems="center" justify="center">
          {checkBox(classes, dictionary.powerMotor)}
          {CommunGrid(classes, dictionary.temp, this.handleChange)}
        </Grid>
        <Grid container item xs={12} alignItems="center" justify="center">
          {checkBox(classes, dictionary.exitAux)}
          {CommunGrid(classes, dictionary.time, this.handleChange)}
        </Grid>
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
