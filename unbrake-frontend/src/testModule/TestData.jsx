import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { withStyles, Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import styles from "./Styles";

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
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid container item justify="center" alignItems="center" xs>
        <Grid container item justify="center" alignItems="flex-start" xs={6}>
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
      data: {
        TES: "10", // TES
        TEI: "20", // TEI
        TEC: "30", // TEC
        SA: "40", // Snub atual
        TS: "50", // Total de Snubs
        DTE: "60" // Duração total do ensaio
        // PE: "70" // Progresso do Ensaio -- valor esta sendo definido (SA/TS)*100
      }
    };
    this.handleChange = this.handleChange.bind(this);
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
    const { classes } = this.props;
    const { data } = this.state;
    const { TES, TEI, TEC, SA, TS, DTE } = data;

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
      <Grid container xs={12} item justify="center">
        <Grid
          container
          xs={12}
          className={classes.gridInformations}
          item
          justify="center"
        >
          <Grid container item alignItems="flex-start" justify="center" xs={3}>
            {/* <Grid container item alignItems="center" justify="center" xs={12} > */}
            {allPower(powerStates, classes)}
            {/* </Grid> */}
          </Grid>
          <Grid container item alignItems="flex-start" justify="center" xs={9}>
            <Grid
              container
              item
              // alignItems="center"
              justify="center"
              xs={12}
            >
              {testInformations(informations, classes)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          {testProgress(testPro, classes)}
        </Grid>
        {/* <Grid container item justify="center" xs={12}> */}
        {/* <h1>Tiago Miguel</h1>
						<LinearProgress variant="determinate" value={20} /> */}
        {/* <LinearProgress variant="determinate" value={20} /> */}

        {/* </Grid> */}
      </Grid>
    );
  }
}

TestData.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

const TestDataForm = reduxForm({
  form: "test"
})(TestData);

export default withStyles(styles)(TestDataForm);
