import React from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Button,
  Checkbox,
  FormControlLabel,
  Grid
} from "@material-ui/core";
import { TextField } from "redux-form-material-ui";
import { reduxForm, Field } from "redux-form";
import request from "../utils/request";

const baseUrl = "http://localhost:8000/graphql";
const limits = (value, allValues) => {
  return allValues.LSL >= allValues.USL ? "Valores Inválidos" : undefined;
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
    padding: "5px"
  },
  gridButton: {
    paddingLeft: theme.spacing.unit + theme.spacing.unit
  }
});

const textLabel = name => {
  if (name === "NOS") return "Número de Snubs";

  if (name === "USL") return "Limite Superior(km/h)";

  if (name === "UWT") return "Tempo de Espera Superior(s)";

  if (name === "LWT") return "Tempo de Espera Inferior(s)";

  if (name === "TBS") return "Tempo Entre Ciclos";

  if (name === "LSL") return "Limite Inferior(km/h)";

  if (name === "TAS") return "Temperatura(˚C)(AUX1)";

  return "Tempo (s)(AUX1)";
};

const Grid1 = (classes, TMO, handleChange) => {
  return (
    <Grid item xs={3} className={classes.gridButton} justify="center">
      <FormControlLabel
        control={
          <Checkbox checked={TMO} onChange={handleChange("TMO")} value="TMO" />
        }
        label="Inibe Desligamento do Motor"
      />
    </Grid>
  );
};

const Grid2 = (classes, type, handleChange) => {
  return (
    <Grid item xs={6} className={classes.grid}>
      <Field
        id={type[1]}
        name={type[1]}
        label={textLabel(type[1])}
        value={type[0]}
        component={TextField}
        onChange={handleChange(type[1])}
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        margin="normal"
        variant="outlined"
      />
    </Grid>
  );
};

const Grid3 = (classes, TAO, handleChange) => {
  return (
    <Grid item xs={3} className={classes.gridButton}>
      <FormControlLabel
        control={
          <Checkbox checked={TAO} onChange={handleChange("TAO")} value="TAO" />
        }
        label="Ativa Saída Auxiliar"
      />
    </Grid>
  );
};

const Grid4 = (classes, submitting) => {
  return (
    <Grid item xs={3} className={classes.grid} justify="right">
      <Button
        color="secondary"
        variant="contained"
        type="submit"
        disabled={submitting}
      >
        Cadastrar
      </Button>
    </Grid>
  );
};

const CommunGrid = (classes, type, handleChange) => {
  return (
    <Grid item xs={3} className={classes.grid}>
      <Field
        id={type[1]}
        component={TextField}
        label={textLabel(type[1])}
        value={type[0]}
        onChange={handleChange(type[1])}
        type="number"
        validate={limits}
        name={type[1]}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        margin="normal"
        variant="outlined"
      />
    </Grid>
  );
};

const Grids = (classes, handleChange, dictionary) => {
  return (
    <Grid alignItems="center" justify="center" container spacing={12}>
      <Grid container item xs={24} alignItems="center" justify="center">
        {CommunGrid(classes, dictionary.snub, handleChange)}
        {CommunGrid(classes, dictionary.limUp, handleChange)}
        {CommunGrid(classes, dictionary.waitUp, handleChange)}
      </Grid>
      <Grid container item xs={24} alignItems="center" justify="center">
        {CommunGrid(classes, dictionary.cicleTime, handleChange)}
        {CommunGrid(classes, dictionary.limLow, handleChange)}
        {CommunGrid(classes, dictionary.waitLow, handleChange)}
      </Grid>
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

  const response = await request(url, method);

  return response;
}

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NOS: "",
      USL: "",
      LSL: "",
      UWT: "",
      LWT: "",
      TBS: "",
      TAS: "",
      TAT: "",
      TMO: false,
      TAO: false
    };
    this.handleChange = name => event => {
      this.setState({
        [name]: event.target.value
      });
    };
    this.checkHandleChange = name => event => {
      this.setState({ [name]: event.target.checked });
    };
  }

  render() {
    const { classes, handleSubmit, submitting } = this.props;
    const { TAS, TAT, TMO, TAO, UWT, NOS, LSL, USL, TBS, LWT } = this.state;
    const dictionary = {
      snub: [NOS, "NOS"],
      limLow: [LSL, "LSL"],
      limUp: [USL, "USL"],
      waitUp: [UWT, "UWT"],
      waitLow: [LWT, "LWT"],
      cicleTime: [TBS, "TBS"],
      temperature: [TAS, "TAS"]
    };
    const time = [TAT, "TAT"];

    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        container
        spacing={12}
      >
        <form
          className={classes.container}
          autoComplete="off"
          onSubmit={handleSubmit(values => {
            submit(values, this.state);
          })}
        >
          {Grids(classes, this.handleChange, dictionary)}
          <Grid container item xs={24} alignItems="center" justify="center">
            {Grid1(classes, TMO, this.checkHandleChange)}
            {Grid2(
              classes,
              dictionary.temperature,
              this.handleChange,
              submitting
            )}
          </Grid>
          <Grid container item xs={24} alignItems="center" justify="center">
            {Grid3(classes, TAO, this.checkHandleChange)}
            {CommunGrid(classes, time, this.handleChange)}
            {Grid4(classes, submitting)}
          </Grid>
        </form>
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const ConfigurationForm = reduxForm({
  form: "configuration"
})(Configuration);

export default withStyles(styles)(ConfigurationForm);
