import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RealTimeChart from "../components/RealTimeChart";
import { changeConfigTest, changeCalibTest } from "../actions/TestActions";
import General from "./General";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

const margin = 1.5;
const zeroTab = 0;
const firstTab = 1;
const secondTab = 2;
const thirdTab = 3;
const fourthTab = 4;
const fifthTab = 5;
const invalidId = 0;

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

const generalComponent = mqttKey => {
  return <Grid xs>{mqttKey !== "" && <General mqttKey={mqttKey} />}</Grid>;
};

class TabMenuComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      mqttKey: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  componentDidMount() {
    const url = `${API_URL_GRAPHQL}/mqtt-reading-key`;
    Request(url, "GET").then(json => {
      this.setState({ mqttKey: json.key });
    });
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  handleChangeSelect(event) {
    const { changeCalib, changeConfig } = this.props;
    const { name, value } = event.target;

    const id = value === invalidId ? "" : value;

    if (name === "configId") changeConfig({ configId: id });
    else if (name === "calibId") changeCalib({ calibId: id });
  }

  render() {
    const { classes } = this.props;
    const { value, mqttKey } = this.state;
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
              <Tab label="Gerais" />
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
          {value === zeroTab && generalComponent(mqttKey)}
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
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  changeCalib: PropTypes.func.isRequired,
  changeConfig: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    configId: state.testReducer.configId,
    calibId: state.testReducer.calibId
  };
};

const mapDispatchToProps = dispatch => ({
  changeCalib: payload => dispatch(changeCalibTest(payload)),
  changeConfig: payload => dispatch(changeConfigTest(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TabMenuComponent));
