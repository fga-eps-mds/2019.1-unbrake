import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { checkbox, field } from "./CalibrationComponents";

const labelSecondary = name => {
  let nameLabel = "";
  switch (name) {
    case "OFF1":
      nameLabel = "Offset 1";
      break;
    case "OFF2":
      nameLabel = "Offset 2";
      break;
    case "PFkgf1":
      nameLabel = "Plota força 1(kgf)";
      break;
    case "PFkgf2":
      nameLabel = "Plota força 2(kgf)";
      break;
    default:
      nameLabel = "";
      break;
  }
  return nameLabel;
};

const label = name => {
  let nameLabel = "";
  switch (name) {
    case "CHF1":
      nameLabel = "Canal de aquisição 1";
      break;
    case "CHF2":
      nameLabel = "Canal de aquisição 2";
      break;
    case "Fmv1":
      nameLabel = "Força 1(mv)";
      break;
    case "Fmv2":
      nameLabel = "Força 2(mv)";
      break;
    case "Fkgf1":
      nameLabel = "Força 1(kgf)";
      break;
    case "Fkgf2":
      nameLabel = "Força 2(kgf)";
      break;
    case "FCF1":
      nameLabel = "Fator de conversão 1";
      break;
    case "FCF2":
      nameLabel = "Fator de conversão 1";
      break;
    default:
      nameLabel = labelSecondary(name);
      break;
  }
  return nameLabel;
};

const renderField = (states, classes, handleChange) => {
  const type = states;
  type.label = label(states.name);
  return <React.Fragment>{field(type, classes, handleChange)}</React.Fragment>;
};

const rowField = (states, classes, handleChange) => {
  const fields = states.map(value => {
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
  });
  return fields;
};

const allFields = (states, classes, handleChange) => {
  const fields = states.map(value => {
    return (
      <Grid
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
        key={`fields ${value[1].name}`}
      >
        {rowField(value, classes, handleChange)}
      </Grid>
    );
  });
  return fields;
};

const allCheckbox = (selectsControl, classes, handleChange) => {
  const checks = selectsControl.map(value => {
    const type = value;
    type.label = label(value.name);
    return (
      <Grid
        key={`checkbox ${value.name}`}
        alignItems="center"
        justify="center"
        container
        item
        xs={12}
        className={classes.checboxSize}
      >
        {checkbox(type, handleChange)}
      </Grid>
    );
  });
  return checks;
};

const renderDictionary = force => {
  const directionary = [
    [
      { name: "CHF1", value: force.CHF1, disable: true },
      { name: "CHF2", value: force.CHF2, disable: true }
    ],
    [
      { name: "Fmv1", value: force.Fmv1, disable: true },
      { name: "Fmv2", value: force.Fmv2, disable: true }
    ],
    [
      { name: "Fkgf1", value: force.Fkgf1, disable: true },
      { name: "Fkgf2", value: force.Fkgf2, disable: true }
    ],
    [
      { name: "FCF1", value: force.FCF1, disable: false },
      { name: "FCF2", value: force.FCF2, disable: false }
    ],
    [
      { name: "OFF1", value: force.OFF1, disable: false },
      { name: "OFF2", value: force.OFF2, disable: false }
    ]
  ];
  return directionary;
};

class Force extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      force: {
        CHF1: "", // canal de aquisição 1
        CHF2: "", // canal de aquisição 2
        PFkgf1: false, // plota força (kfg) 1
        Fmv1: "", // força (mv) 1
        Fmv2: "", // força (mv) 2
        PFkgf2: false, // plota força (kfg) 1
        Fkgf1: "", // força (kgf) 1
        Fkgf2: "", // força (kgf) 2
        FCF1: "", // fator de conversão 1
        FCF2: "", // fator de conversão 2
        OFF1: "", // offset de força 1
        OFF2: "" // offset de força 2
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const force = { [event.target.name]: value };
    this.setState(prevState => ({
      force: { ...prevState.force, ...force }
    }));
  }

  render() {
    const { force } = this.state;
    const { PFkgf1, PFkgf2 } = force;
    const { classes } = this.props;
    const states = renderDictionary(force);
    const selectsControl = [
      { name: "PFkgf1", value: PFkgf1, disable: false },
      { name: "PFkgf2", value: PFkgf2, disable: false }
    ];
    return (
      <Grid
        container
        xs={12}
        item
        justify="center"
        style={{ marginTop: "70px" }}
      >
        <Grid alignItems="center" justify="center" container>
          <form className={classes.container}>
            <Grid item xs />
            <Grid container item justify="center" xs={6}>
              {allFields(states, classes, this.handleChange)}
            </Grid>
            <Grid
              container
              item
              alignItems="flex-start"
              justify="center"
              xs={3}
            >
              <Grid container item alignItems="center" justify="center" xs={12}>
                {allCheckbox(selectsControl, classes, this.handleChange)}
              </Grid>
            </Grid>
            <Grid item xs />
          </form>
        </Grid>

        <Grid
          item
          container
          xs={9}
          justify="center"
          className={classes.gridGraphic}
        >
          <RealTimeChart />
        </Grid>
      </Grid>
    );
  }
}

Force.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const ForceForm = reduxForm({
  form: "calibration"
})(Force);

export default withStyles(styles)(ForceForm);
