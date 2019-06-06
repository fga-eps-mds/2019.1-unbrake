import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import styles from "../components/Styles";
import RealTimeChart from "../components/RealTimeChart";
import { checkbox, field } from "../components/ComponentsForm";

const labelSecondary = name => {
  let nameLabel = "";
  switch (name) {
    case "Vkm":
      nameLabel = "Velocidade (Km/h)";
      break;
    case "Vms":
      nameLabel = "Velocidade (m/s)";
      break;
    case "DPkm":
      nameLabel = "Distância percorrida (km)";
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
    case "CHA":
      nameLabel = "Canal de aquisição";
      break;
    case "Fhz":
      nameLabel = "Frequência (Hz)";
      break;
    case "Rrpm":
      nameLabel = "Rotação (RPM)";
      break;
    case "RPm":
      nameLabel = "Raio do pneu (m)";
      break;
    case "PRrpm":
      nameLabel = "Plota rotação (rpm)";
      break;
    case "PVkmh":
      nameLabel = "Plota velocidade (Km/h)";
      break;
    case "PDPkm":
      nameLabel = "Plota distândia percorrida (Km)";
      break;
    case "ID":
      nameLabel = "Inicializa Distancia";
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
        key={`fields ${value[0].name}`}
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

const renderDictionary = speed => {
  const directionary = [
    [{ name: "CHA", value: speed.CHA, disable: true }],
    [
      { name: "Fhz", value: speed.Fhz, disable: true },
      { name: "Vkm", value: speed.Vkm, disable: true }
    ],
    [
      { name: "Rrpm", value: speed.Rrpm, disable: true },
      { name: "Vms", value: speed.Vms, disable: true }
    ],
    [
      { name: "RPm", value: speed.RPm, disable: true },
      { name: "DPkm", value: speed.DPkm, disable: false }
    ]
  ];
  return directionary;
};

const checkboxes = speed => {
  const { PRrpm, PVkmh, PDPkm, ID } = speed;
  return [
    { name: "PRrpm", value: PRrpm, disable: false },
    { name: "PVkmh", value: PVkmh, disable: false },
    { name: "PDPkm", value: PDPkm, disable: false },
    { name: "ID", value: ID, disable: false }
  ];
};

class Speed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: {
        CHA: "", // canal de aquisição
        Fhz: "", // frequencia
        PRrpm: false, // plota rotação
        Rrpm: "", // rotação
        RPm: "", // raio pneu
        PVkmh: false, // plota velocidade
        Vkm: "", // velocidade km/h
        Vms: "", // velocidade m/s
        DPkm: "", // distância percorrida
        PDPkm: false, // plota distância percorrida
        ID: false // Inicializa distancia
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
    const { speed } = this.state;
    const { classes } = this.props;
    const states = renderDictionary(speed);
    const selectsControl = checkboxes(speed);
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

Speed.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const SpeedForm = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(Speed);

export default withStyles(styles)(SpeedForm);
