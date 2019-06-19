import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import RealTimeChart from "../components/RealTimeChart";
import { itensSelectionConfig } from "../configuration/Configuration";
import { itensSelection } from "../calibration/CalibrationUpload";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";
import { changeConfigTest, changeCalibTest } from "../actions/TestActions";

const margin = 1.5;
const zeroTab = 0;
const firstTab = 1;
const secondTab = 2;
const thirdTab = 3;
const fourthTab = 4;
const fifthTab = 5;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    borderRadius: theme.spacing.unit * margin,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px"
  }
});

/*
 * const submitCalib = (test, allCalibration) => {
 *   const moveIndexBack = 1;
 *   const { value } = test.target.value;
 *   const calib = allCalibration[value - moveIndexBack];
 *   if (calib !== undefined) {
 *     const { id } = calib.id;
 *     const { name } = calib.name;
 *     changeCalibTest({ calibId: id, calibName: name });
 *   }
 * };
 */

/*
 * const submitConfig = (test, allConfiguration) => {
 *   const { value } = test.target.value;
 *   const moveIndexBack = 1;
 *   const conditionCompare = 0;
 *   if (value - moveIndexBack >= conditionCompare) {
 *     const config = allConfiguration[value - moveIndexBack];
 *     const configId = config.id;
 *     const configName = config.name;
 *     changeConfigTest({ configId, configName });
 *   }
 * };
 */

class TabMenuComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      calibrationSelect: 0,
      configurationSelect: 0,
      allCalibration: "",
      allConfiguration: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    const urlCalib = `${API_URL_GRAPHQL}?query=query{allCalibration{id, name, isDefault}}`;
    const method = "GET";
    Request(urlCalib, method).then(json => {
      const data = json.data.allCalibration;
      if (data !== null) {
        this.setState({ allCalibration: data });
      }
    });

    const urlConfig = `${API_URL_GRAPHQL}?query=query{configNotDefault{id, name}}`;

    Request(urlConfig, method).then(json => {
      const data = json.data.configNotDefault;
      if (data !== null) this.setState({ allConfiguration: data });
    });
  }

  selectDefault() {
    const { classes } = this.props;
    const {
      allCalibration,
      allConfiguration,
      calibrationSelect,
      configurationSelect
    } = this.state;
    return (
      <div style={{ flex: 1 }}>
        <TextField
          id="outlined-select-currency"
          select
          label="Calibrações"
          value={calibrationSelect}
          name="calibrationSelect"
          className={classes.formControl}
          margin="normal"
          variant="outlined"
          style={{ width: "100%" }}
          onChange={this.handleChangeSelect}
        >
          {itensSelection(allCalibration)}
        </TextField>
        <TextField
          id="outlined-select-currency"
          select
          label="Configurações"
          value={configurationSelect}
          name="configurationSelect"
          className={classes.formControl}
          margin="normal"
          variant="outlined"
          style={{ width: "100%" }}
          onChange={this.handleChangeSelect}
        >
          {itensSelectionConfig(allConfiguration)}
        </TextField>
      </div>
    );
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  handleChangeSelect(event) {
    // const { sendMessage } = this.props;

    this.setState({ [event.target.name]: event.target.value });

    /*
     * const invalidId = 0;
     * if (
     *   event.target.name === "dataBaseCalibration" &&
     *   event.target.value > invalidId
     * )
     * getSelectCalibration(event.target.value, dispatch, sendMessage);
     */
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <Grid
        item
        container
        xs={12}
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item container xs={11} justify="center" alignItems="center">
          <AppBar
            color="inherit"
            className={classes.appBar}
            position="relative"
          >
            <Tabs centered value={value} onChange={this.handleChange}>
              <Tab label="Configurações" />
              <Tab label="Temperatura" />
              <Tab label="Força" />
              <Tab label="Rotação" />
              <Tab label="Velocidade" />
              <Tab label="Distância" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid
          item
          container
          xs={11}
          justify="center"
          alignItems="center"
          style={{ paddingTop: "15px" }}
        >
          {value === zeroTab && (
            <div style={{ flex: 1 }}>{this.selectDefault()}</div>
          )}
          {value === firstTab && <RealTimeChart />}
          {value === secondTab && <RealTimeChart />}
          {value === thirdTab && <RealTimeChart />}
          {value === fourthTab && <RealTimeChart />}
          {value === fifthTab && <RealTimeChart />}
        </Grid>
      </Grid>
    );
  }
}

TabMenuComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  /*
   * configId: PropTypes.string.isRequired,
   * calibId: PropTypes.string.isRequired
   */
  /*
   * changeCalibTest: PropTypes.func.isRequired,
   * changeConfigTest: PropTypes.func.isRequired
   */
};

const mapStateToProps = state => {
  return {
    configName: state.testReducer.configName,
    configId: state.testReducer.configId,
    calibName: state.testReducer.calibName,
    calibId: state.testReducer.calibId
  };
};

const mapDispatchToProps = dispatch => ({
  changeCalibTest: payload => dispatch(changeCalibTest(payload)),
  changeConfigTest: payload => dispatch(changeConfigTest(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TabMenuComponent));
