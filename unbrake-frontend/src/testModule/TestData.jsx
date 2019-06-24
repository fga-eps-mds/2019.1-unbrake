import React from "react";
import PropTypes from "prop-types";
import { reduxForm, change } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as emitter from "emitter-io";
import { connect } from "react-redux";
import styles from "./Styles";
import { MQTT_HOST, MQTT_PORT } from "../utils/Constants";

const percentageTransformer = 100;

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

const calculeTES = (states, functions) => {
  const { handleChange } = functions;
  const { dutyCycle, waiting, waitingStartTime, configuration, state } = states;

  if (state.TEI !== 0) handleChange("TEI", 0);

  if (state.TEC !== 0) handleChange("TEC", 0);

  if (!waiting) {
    if (waitingStartTime !== 0) handleChange("waitingStartTime", 0);

    handleChange("TES", dutyCycle);

    // console.log("TES", states);
    if (dutyCycle >= 99) {
      handleChange("waiting", true);
    }
  } else {
    if (waitingStartTime === 0) {
      handleChange("waitingStartTime", Date.now());
      return;
    }

    // console.log("TES tempo", states);

    const time = Date.now() - waitingStartTime;
    const centiseconds = Math.floor(time / 10);

    const UWT = 1000; // configuration.UWT * 100;

    if (centiseconds < UWT) {
      handleChange("TES", (1 - centiseconds / UWT) * 100);
    } else {
      handleChange("TES", 0);
      handleChange("waiting", false);
    }
  }
};

const calculeTEI = (states, functions) => {
  const { handleChange } = functions;
  const { dutyCycle, waiting, waitingStartTime, configuration, state } = states;

  if (state.TES !== 0) handleChange("TES", 0);

  if (state.TEC !== 0) handleChange("TEC", 0);

  if (!waiting) {
    if (waitingStartTime !== 0) handleChange("waitingStartTime", 0);

    const convertionDuty = 100 - dutyCycle;
    const minVelocity = 100 - 30; // configuration.LSL;
    const valueProgress = (convertionDuty / minVelocity) * 100;

    handleChange("TEI", valueProgress);

    // console.log("TEI", states);
    if (valueProgress >= 99) {
      handleChange("waiting", true);
      // console.log("ETNROU AQUI");
    }
  } else {
    if (waitingStartTime === 0) {
      handleChange("waitingStartTime", Date.now());
      return;
    }
    // console.log("TEI tempo", states);

    const time = Date.now() - waitingStartTime;
    const centiseconds = Math.floor(time / 10);

    const LSL = 1000; // configuration.LSL * 100;

    if (centiseconds < LSL) {
      handleChange("TES", (1 - centiseconds / LSL) * 100);
    } else {
      handleChange("TES", 0);
      handleChange("waiting", false);
    }
  }
};

const calculeTEC = (states, functions) => {
  const { handleChange } = functions;
  const { waitingStartTime, configuration, state } = states;

  if (state.TES !== 0) handleChange("TES", 0);

  if (state.TEI !== 0) handleChange("TEI", 0);

  // console.log("TEC tempo", states);

  if (waitingStartTime === 0) {
    handleChange("waitingStartTime", Date.now());
    handleChange("TEC", 100);
    return;
  }

  const time = Date.now() - waitingStartTime;
  const centiseconds = Math.floor(time / 10);

  const TBS = 1000; // configuration.TBS * 100;

  if (centiseconds < TBS) {
    handleChange("TEC", (1 - centiseconds / TBS) * 100);
  } else {
    handleChange("TEC", 0);
    handleChange("waiting", false);
  }
};

class TestData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TES: "", // TES
      TEI: "", // TEI
      TEC: "", // TEC
      SA: "", // Snub atual
      TS: "", // Total de Snubs
      DTE: "", // Duração total do ensaio
      snubState: "",
      dutyCycle: "",
      waitingStartTime: 0,
      experimentDuration: "",
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
      channel: "unbrake/galpao/snubDuration"
    });
    this.client.subscribe({
      key: props.mqttKey,
      channel: "unbrake/galpao/experimentDuration"
    });
    this.currentSnubSensor = 0;

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const {
      classes,
      testAquisition,
      configuration,
      dispatch,
      change,
      testData
    } = this.props;

    this.client.on("message", msg => {
      // console.log(msg.channel, msg.asString());
      if (msg.channel === "unbrake/galpao/currentSnub/") {
        this.setState({ SA: msg.asString() });
      } else if (msg.channel === "unbrake/galpao/snubState/") {
        this.setState({ snubState: msg.asString() });
      } else if (msg.channel === "unbrake/galpao/dutyCycle/") {
        this.setState({ dutyCycle: msg.asString() });
      } else if (msg.channel === "unbrake/galpao/snubDuration/") {
        // console.log(msg.channel, msg.asString())
      } else if (msg.channel === "unbrake/galpao/experimentDuration/") {
        this.setState({ experimentDuration: msg.asString() });
      }

      const { snubState, dutyCycle, waiting, waitingStartTime } = this.state;
      const states = {
        configuration,
        testAquisition,
        snubState,
        dutyCycle,
        waiting,
        waitingStartTime,
        testData,
        state: this.state,
        testAquisition: testAquisition.values,
        configuration: configuration.values
      };

      const functions = { handleChange: this.handleChange };

      if (snubState === "acelerating" || snubState === "aceleratingWater")
        calculeTES(states, functions);
      if (snubState === "braking" || snubState === "brakingWater")
        calculeTEI(states, functions);
      if (snubState === "cooldown" || snubState === "cooldownWater")
        calculeTEC(states, functions);
    });
  }

  /*
   * static getDerivedStateFromProps(props, state) {
   *   if (props.newData !== state.data) {
   *     return { data: props.newData };
   *   }
   *   return null;
   * }
   */

  handleChange(name, value) {
    let differenceFactor = 0.1;
    if (this.state.waiting) differenceFactor = 1;

    const difference = Math.abs(this.state[name] - value);
    if (difference < differenceFactor) return;

    this.setState({ [name]: value });
  }

  render() {
    const {
      classes,
      testAquisition,
      configuration,
      dispatch,
      change,
      testData
    } = this.props;
    const {
      snubState,
      TES,
      TEI,
      TEC,
      SA,
      TS,
      DTE,
      dutyCycle,
      waiting,
      waitingStartTime
    } = this.state;

    const states = {
      configuration,
      testAquisition,
      snubState,
      dutyCycle,
      waiting,
      waitingStartTime,
      testData,
      state: this.state,
      testAquisition: testAquisition.values,
      configuration: configuration.values
    };
    const functions = { handleChange: this.handleChange };

    /*
     * if (snubState === "acelerating" || snubState === "aceleratingWater")
     * calculeTES(states, functions);
     */
    /*
     * calculeTEI();
     * calculeTEC();
     */

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
  configuration: { values: {} },
  testAquisition: { values: {} }
};

TestData.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  newData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  mqttKey: PropTypes.string.isRequired,
  configuration: PropTypes.object,
  testAquisition: PropTypes.object
};

const mapStateToProps = state => {
  return {
    configName: state.testReducer.configName,
    configId: state.testReducer.configId,
    calibName: state.testReducer.calibName,
    calibId: state.testReducer.calibId,
    testAquisition: state.form.testAquisition,
    configuration: state.form.configuration,
    testData: state.form.testData
  };
};

const TestDataForm = reduxForm({
  form: "testData"
})(TestData);

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(TestDataForm));
