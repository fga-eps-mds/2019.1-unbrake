import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as emitter from "emitter-io";
import { connect } from "react-redux";
import styles from "./Styles";
import { MQTT_HOST, MQTT_PORT } from "../utils/Constants";
import { changeConfigTest } from "../actions/TestActions";
import { resolveMsg, calculeTEC, calculeTEI, calculeTES } from "./TestDataAux";

const percentageTransformer = 100;
const diffFactor = 0.1;
const one = 1;

const label = name => {
  let labelName;
  switch (name) {
    case "SA":
      labelName = "Snub atual";
      break;
    case "TS":
      labelName = "Total de Snubs";
      break;
    case "DTE":
      labelName = "Duração total do Ensaio";
      break;
    case "PE":
      labelName = "Progresso do ensaio";
      break;
    default:
      labelName = "";
      break;
  }
  return labelName;
};

const progress = (value, classes) => {
  return (
    <div>
      <div className={classes.progress}>
        <LinearProgress
          className={classes.progress}
          variant="determinate"
          value={value}
        />
      </div>
    </div>
  );
};

const heigthProgress = (value, classes) => {
  return (
    <div>
      <div>
        <LinearProgress
          className={classes.progressHeight}
          variant="determinate"
          value={value}
        />
      </div>
    </div>
  );
};

const allPower = (powerStates, classes) => {
  const render = powerStates.map(value => {
    return (
      <Grid
        container
        item
        justify="center"
        xs={4}
        className={classes.gridAllPower}
      >
        {heigthProgress(value.value, classes)}
        <spam>{value.name}</spam>
      </Grid>
    );
  });
  return render;
};

const testProgress = (testPro, classes) => {
  return (
    <Grid
      item
      xs
      className={classes.gridProgress}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid container item justify="center" alignItems="center" xs>
        <Grid container item justify="center" alignItems="flex-start" xs={12}>
          <Grid container item justify="center" alignItems="flex-start" xs={12}>
            <spam className={classes.labelProgress}>{label(testPro.name)}</spam>
          </Grid>
          <Grid container item justify="center" alignItems="flex-start" xs={12}>
            {progress(testPro.value, classes)}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const infoSnub = (informations, classes) => {
  const render = informations.map(value => {
    return (
      <Grid container item justify="center" alignItems="flex-start" xs={6}>
        <Grid container item justify="center" alignItems="flex-start" xs={12}>
          <spam className={classes.labelTitle}>{label(value.name)}</spam>
        </Grid>
        <Grid container item justify="center" alignItems="flex-start" xs={12}>
          <spam>{value.value}</spam>
        </Grid>
      </Grid>
    );
  });
  return render;
};

const testInformations = (informations, classes) => {
  return (
    <Grid
      item
      xs
      className={classes.gridInformations}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid container item justify="center" alignItems="center" xs>
        {infoSnub(informations[0], classes)}
      </Grid>
      <Grid container item justify="center" alignItems="center" xs>
        <Grid container item justify="center" alignItems="flex-start" xs={12}>
          <Grid container item justify="center" alignItems="flex-start" xs={12}>
            <spam className={classes.labelTitle}>
              {label(informations[1].name)}
            </spam>
          </Grid>
          <Grid container item justify="center" alignItems="flex-start" xs={12}>
            <spam>{informations[1].value}</spam>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

class TestData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TES: "", // TES
      TEI: "", // TEI
      TEC: "", // TEC
      SA: "1", // Snub atual
      TS: "", // Total de Snubs
      DTE: "", // Duração total do ensaio
      snubState: "",
      dutyCycle: "",
      waitingStartTime: 0,
      waiting: false
    };

    this.client = emitter.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      secure: false
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/currentSnub"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/snubState"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/dutyCycle"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/experimentDuration"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/isAvailable/"
    });

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { configuration } = this.props;

    if (
      configuration.values === undefined ||
      configuration.values.NOS === undefined
    );
    else this.handleChange("TS", configuration.values.NOS);

    this.client.on("message", msg => {
      resolveMsg(msg, this.handleChange);

      const { snubState, dutyCycle, waiting, waitingStartTime } = this.state;
      const states = {
        snubState,
        dutyCycle,
        waiting,
        waitingStartTime,
        state: this.state,
        configuration: configuration.values
      };

      if (snubState === "acelerating" || snubState === "aceleratingWater")
        calculeTES(states, this.handleChange);
      if (snubState === "braking" || snubState === "brakingWater")
        calculeTEI(states, this.handleChange);
      if (snubState === "cooldown" || snubState === "cooldownWater")
        calculeTEC(states, this.handleChange);
    });
  }

  handleChange(name, value) {
    const { waiting } = this.state;

    let differenceFactor = diffFactor;
    if (waiting) differenceFactor = one;

    const states = this.state;

    const difference = Math.abs(states[name] - value);
    if (difference < differenceFactor) return;

    this.setState({ [name]: value });
  }

  render() {
    const { classes } = this.props;
    const { TES, TEI, TEC, SA, TS, DTE } = this.state;

    const powerStates = [
      { name: "TES", value: TES },
      { name: "TEI", value: TEI },
      { name: "TEC", value: TEC }
    ];
    const informations = [
      [{ name: "SA", value: SA }, { name: "TS", value: TS }],
      { name: "DTE", value: DTE }
    ];
    const testPro = { name: "PE", value: (SA / TS) * percentageTransformer };

    return (
      <Grid justify="center" item xs alignItems="flex-start">
        <Grid container justify="center" alignItems="flex-start">
          <h3 styles={{ height: "22px" }}>Dados do ensaio</h3>
        </Grid>
        <Grid container xs={12} item justify="center" alignItems="flex-start">
          <Grid
            container
            xs={12}
            className={classes.gridInformations}
            item
            justify="center"
          >
            <Grid container item alignItems="flex-start" xs={3}>
              {allPower(powerStates, classes)}
            </Grid>
            <Grid container item alignItems="flex-start" xs={9}>
              <Grid container item alignItems="center" justify="center" xs={12}>
                {testInformations(informations, classes)}
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center" justify="center" xs={12}>
            {testProgress(testPro, classes)}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

TestData.defaultProps = {
  configuration: { values: {} }
};

TestData.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  mqttKey: PropTypes.string.isRequired,
  configuration: PropTypes.string
};

const mapStateToProps = state => {
  return {
    configName: state.testReducer.configName,
    configId: state.testReducer.configId,
    calibName: state.testReducer.calibName,
    calibId: state.testReducer.calibId,
    configuration: state.form.configuration
  };
};

const mapDispatchToProps = dispatch => ({
  changeConfig: payload => dispatch(changeConfigTest(payload))
});

const TestDataForm = reduxForm({
  form: "testData"
})(TestData);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TestDataForm));
