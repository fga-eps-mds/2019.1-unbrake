import React from "react";
import PropTypes from "prop-types";
import { initialize, Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, Button, FormControlLabel, Grid } from "@material-ui/core";

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

  if (name === "UWT" || name === "LWT") return "Tempo de Espera(s)";

  if (name === "TBS") return "Tempo Entre Ciclos";

  if (name === "LSL") return "Limite Inferior(km/h)";

  if (name === "TAS") return "Temperatura(˚C)(AUX1)";

  return "Tempo (s)(AUX1)";
};

const Grid1 = (classes, type) => {
  return (
    <Grid item xs={3} className={classes.gridButton} justify="center">
      <FormControlLabel
        control={<Field component={Checkbox} name={type[1]} value={type[0]} />}
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

const Grid4 = (classes, submitting) => {
  return (
    <Grid item xs={3} className={classes.grid} justify="right">
      <Button color="secondary" variant="contained" disabled={submitting}>
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

class ConfigurationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration: {
        NOS: "",
        USL: "",
        LSL: "",
        UWT: "",
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
      // console.log(configuration);
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
    // console.log(this.state);

    if (configuration !== nextProps.configuration) {
      // console.log("bla", nextProps.configuration.CONFIG_ENSAIO.NOS);
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
    // console.log("teste");
    const { classes, handleSubmit, submitting } = this.props;
    const { configuration } = this.state;
    const { TAS, TAT, TMO, TAO, UWT, NOS, LSL, USL, TBS, LWT } = configuration;
    const dictionary = {
      snub: [NOS, "NOS"],
      limUp: [USL, "USL"],
      waitUp: [UWT, "UWT"],
      cicleTime: [TBS, "TBS"],
      limLow: [LSL, "LSL"],
      waitLow: [LWT, "LWT"],
      powerMotor: [TMO, "TMO"],
      exitAux: [TAO, "TAO"],
      temp: [TAS, "TAS"],
      time: [TAT, "TAT"]
    };

    // console.log(this.props);
    return (
      <form
        className={classes.container}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {Grids(classes, this.handleChange, dictionary)}
        <Grid container item xs={24} alignItems="center" justify="center">
          {Grid1(classes, dictionary.powerMotor)}
          {Grid2(classes, dictionary.temp, this.handleChange)}
        </Grid>
        <Grid container item xs={24} alignItems="center" justify="center">
          {Grid1(classes, dictionary.powerMotor)}
          {CommunGrid(classes, dictionary.time, this.handleChange)}
          {Grid4(classes, submitting)}
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
