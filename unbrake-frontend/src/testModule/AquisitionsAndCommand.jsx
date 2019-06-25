import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { reduxForm, Field, initialize } from "redux-form";
import { withStyles, Grid, FormControlLabel } from "@material-ui/core";
import { Checkbox } from "redux-form-material-ui";
import Button from "@material-ui/core/Button";
import { redirectPage } from "../actions/RedirectActions";
import styles from "./Styles";
import { field } from "../components/ComponentsForm";

import OfflineBolt from "@material-ui/icons/OfflineBolt";
import OfflineBoltOutlined from "@material-ui/icons/OfflineBoltOutlined";
import ReportProblem  from "@material-ui/icons/ReportProblem";
import ReportProblemOutlined from "@material-ui/icons/ReportProblemOutlined";
import WatchLaterOutlined from "@material-ui/icons/WatchLaterOutlined";
import WatchLater from "@material-ui/icons/WatchLater";
import BeachAccessOutlined from "@material-ui/icons/BeachAccessOutlined";
import BeachAccess from "@material-ui/icons/BeachAccess";

const labelFields = name => {
  let nameLabel = "";
  switch (name) {
    case "Tc1":
      nameLabel = "Temperatura 1 (ºC)";
      break;
    case "Tc2":
      nameLabel = "Temperatura 2(ºC)";
      break;
    case "Fkgf1":
      nameLabel = "Força 1 (kfg)";
      break;
    case "Fkgf2":
      nameLabel = "Força 2 (kfg)";
      break;
    case "Rrpm":
      nameLabel = "Rotação (RPM)";
      break;
    case "Vkmg":
      nameLabel = "Velocidade (km/h)";
      break;
    case "DPm":
      nameLabel = "Distância percorrida (m)";
      break;
    case "Vc":
      nameLabel = "Velocidade (comando)";
      break;
    case "Pc":
      nameLabel = "Pressão (comando)";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

const previousButton = handlePrevious => {
  return (
    <Button onClick={handlePrevious} color="secondary" variant="contained">
      Etapa anterior
    </Button>
  );
};

const accelerateCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<OfflineBoltOutlined color="secondary"/>}
          checkedIcon={<OfflineBolt style={{ color: "green" }}/>}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  )
}

const brakeCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<ReportProblemOutlined color="secondary"/>}
          checkedIcon={<ReportProblem style={{ color: "red" }}/>}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  )
}

const cooldownCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<WatchLaterOutlined color="secondary"/>}
          checkedIcon={<WatchLater style={{ color: "#ffd600" }}/>}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  )
}

const waterCheckbox = (value, classes, handleChange) => {
  return (
    <FormControlLabel
      className={classes.checbox_control}
      labelPlacement="top"
      control={
        <Field
          component={Checkbox}
          icon={<BeachAccessOutlined color="secondary"/>}
          checkedIcon={<BeachAccess style={{ color: "blue" }}/>}
          className={classes.checbox_field}
          disabled={value.disable}
          onClick={handleChange}
          name={value.name}
          value={value.value}
        />
      }
      label={value.label}
    />
  )
}

const allCheckbox = (selectsControl, classes, handleChange) => {
    return (
      <Grid container item={12}>
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={3}
      >
        {accelerateCheckbox(selectsControl[0],classes, handleChange)}
      </Grid>
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={3}
      >
        {brakeCheckbox(selectsControl[1],classes, handleChange)}
      </Grid>
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={3}
      >
        {cooldownCheckbox(selectsControl[2],classes, handleChange)}
      </Grid>
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={3}
      >
        {waterCheckbox(selectsControl[3],classes, handleChange)}
      </Grid>
      </Grid>
    )
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = labelFields(states.name);
  return <React.Fragment>{field(type, classes, handleChange)}</React.Fragment>;
};

const rowField = (states, classes, handleChange) => {
  const fields = states.map(value => {
    if (value.length === undefined) {
      return (
        <Grid
          key={`component ${value.name}`}
          alignItems="center"
          justify="center"
          container
          item
          xs={6}
        >
          {renderField(value, classes, handleChange)}
        </Grid>
      );
    }
    // checkboxs para informar os componentes conectados
    return (
      <Grid
        key={`component ${value.name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={6}
      >
        {allCheckbox(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const allFields = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid alignItems="center" justify="center" container item xs={12}>
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const renderDictionary = aquisition => {
  const directionary = [
    [
      { name: "Tc1", value: aquisition.Tc1, disable: true },
      { name: "Tc2", value: aquisition.Tc2, disable: true }
    ],
    [
      { name: "Fkgf1", value: aquisition.Fkgf1, disable: true },
      { name: "Fkgf2", value: aquisition.Fkgf2, disable: true }
    ],
    [
      { name: "Rrpm", value: aquisition.Rrpm, disable: true },
      { name: "Vkmg", value: aquisition.Vkmg, disable: true }
    ],
    [
      { name: "DPm", value: aquisition.DPm, disable: true },
      { name: "Vc", value: aquisition.Vc, disable: true }
    ],
    [
      { name: "Pc", value: aquisition.Pc, disable: true },
      [
        { label: "Acelerador", name: "acelerate" ,value: aquisition.acelerate, disable: false},
        { label: "Freio", name: "brake", value: aquisition.brake, disable: false},
        { label: "Cooldown", name: "cooldown", value: aquisition.cooldown, disable: false },
        { label: "Água", name: "water", value: aquisition.water, disable: false }
      ]
    ]
  ];
  return directionary;
};

class AquisitionsAndCommand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aquisition: {
        Tc1: "", // Temperatura 1(ºC)
        Tc2: "", // Temperatura 2(ºC)
        Fkgf1: "", // Força 1 (kfg)
        Fkgf2: "", // Força 2 (kfg)
        Rrpm: "", // Rotação (RPM)
        Vkmg: "", // Velocidade (km/h)
        DPm: "", // Distância percorrida (m)
        Vc: "", // Velocidade (comando)
        Pc: "", // Pressão (comando)
        acelerate: true,
        brake: false,
        cooldown: false,
        water: false
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  /*
   * shouldComponentUpdate(nextProps) {
   *   const { newAquisition, dispatch } = this.props;
   *   if (newAquisition !== nextProps.newAquisition) {
   *     const rightConfig = Object.assign({}, nextProps.newAquisition);
   *     dispatch(initialize("testAquisition", rightConfig));
   *     this.setState({ aquisition: rightConfig });
   *     return true;
   *   }
   *   return false;
   * }
   */

  handlePrevious() {
    const { redirect } = this.props;
    redirect({ url: "/calibration" });
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const aquisition = { [event.target.name]: value };
    this.setState(prevState => ({
      aquisition: { ...prevState.aquisition, ...aquisition }
    }));
  }

  render() {
    const { aquisition } = this.state;
    const { classes } = this.props;
    const states = renderDictionary(aquisition);
    return (
      <Grid container xs={12} item justify="center">
        <Grid item xs={4} container justify="center" alignItems="center">
          {previousButton(this.handlePrevious)}
        </Grid>
        <Grid item xs container justify="center" alignItems="center">
          <h3>Aquisições e comandos</h3>
        </Grid>
        <form className={classes.container}>
          <Grid container item justify="center" xs={12}>
            {allFields(states, classes, this.handleChange)}
          </Grid>
        </form>
      </Grid>
    );
  }
}

AquisitionsAndCommand.propTypes = {
  testAquisition: { values: {} },
  calibration: { values: {} }
};

AquisitionsAndCommand.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  newAquisition: PropTypes.oneOfType([PropTypes.object]).isRequired,
  redirect: PropTypes.func.isRequired,
  testAquisition: PropTypes.string,
  calibration: PropTypes.string
};

const mapStateToProps = state => ({
  testAquisition: state.form.testAquisition,
  calibration: state.form.calibration
});

const mapDispatchToProps = dispatch => ({
  redirect: payload => dispatch(redirectPage(payload))
});

const AquisitionsAndCommandForm = reduxForm({
  form: "testAquisition"
})(AquisitionsAndCommand);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AquisitionsAndCommandForm));
