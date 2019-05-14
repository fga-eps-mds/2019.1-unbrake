import React from "react";
import PropTypes from "prop-types";
import { initialize, Field, reduxForm } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles, Button, FormControlLabel, Grid } from "@material-ui/core";
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

const fieldsLabels = {
  NOS: "Numero de Snubs",
  USL: "Limite Superior (km/h)",
  UWT: "Tempo de Espera (s)",
  TBS: "Tempo entre ciclos",
  LSL: "Limite inferior (km/h)",
  LWT: "Tempo de espera (s)"
};

const rowsFields = (classes, vector, handleChange) => {
  let nameField;
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
      <Grid key={`row${nameField}`} container xs={3} item justify="center">
        <div>
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
        </div>
      </Grid>
    );
  });
  return fields;
};

const fieldsConfigurations = (classes, vector, handleChange) => {
  const rows = vector.map(value => {
    return (
      <Grid key={`${value[0].name}`} container xs={12} justify="center" item>
        {rowsFields(classes, value, handleChange)}
      </Grid>
    );
  });
  return rows;
};

const checkBox = (classes, type, handleChange) => {
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
    <Grid container item xs={3} style={{ paddingLeft: 20 }}>
      <FormControlLabel
        name={type.name}
        control={
          <Field
            component={Checkbox}
            onClick={handleChange}
            value={type.value}
          />
        }
        label={label}
      />
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
    <Grid item container xs={3} className={classes.grid} justify="center">
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
        justify="center"
      >
        {checkBox(classes, value[0], handleChange)}
        {CommunGrid(classes, value[1], handleChange)}
        <Grid item container xs={3} />
      </Grid>
    );
  });
  return fields;
};

const Buttons = classes => {
  return (
    <Grid container item xs={3} className={classes.grid}>
      <Button type="submit" color="secondary" variant="contained">
        Cadastrar
      </Button>
    </Grid>
  );
};

const verifyCheckbox = variable => {
  let bool;
  if (variable === "FALSE" || variable === false) {
    bool = false;
  } else {
    bool = true;
  }
  return bool;
};

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
    const { configuration, dispatch } = this.props;
    if (configuration !== nextProps.configuration) {
      const rightConfig = Object.assign({}, nextProps.configuration);
      const next = nextProps.configuration.CONFIG_ENSAIO;
      rightConfig.CONFIG_ENSAIO.TMO = verifyCheckbox(next.TMO);
      rightConfig.CONFIG_ENSAIO.TAO = verifyCheckbox(next.TAO);
      dispatch(initialize("configuration", rightConfig.CONFIG_ENSAIO));
      this.setState({ configuration: rightConfig.CONFIG_ENSAIO });
      return true;
    }
    return false;
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const configuration = { [event.target.name]: value };
    this.setState(prevState => ({
      configuration: { ...prevState.configuration, ...configuration }
    }));
  }

  render() {
    const { classes, handleSubmit, handleClickSave } = this.props;
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
        onSubmit={handleSubmit(() => {
          handleClickSave(this.state);
        })}
      >
        {fieldsConfigurations(classes, rows, this.handleChange)}
        {otherField(classes, othersFields, this.handleChange)}
        <Grid container xs={12} item justify="center">
          <Grid
            item
            container
            xs={6}
            justify="center"
            className={classes.gridButton}
          >
            {Buttons(classes)}
          </Grid>
        </Grid>
      </form>
    );
  }
}

ConfigurationForm.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  configuration: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
  handleClickSave: PropTypes.func.isRequired
};

const Configurationa = reduxForm({
  form: "configuration",
  validate
})(ConfigurationForm);

export default withStyles(styles)(Configurationa);
