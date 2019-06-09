import React from "react";
import "../App.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import CalibrationUpload from "./CalibrationUpload";
import Vibration from "./Vibration";
import Force from "./Force";
import Temperature from "./Temperature";
import Command from "./Command";
import Speed from "./Speed";

const TabPadding = 24;
const borderRadius = 2.5;
const generalConfigsOption = 0;
const temperatureOption = 1;
const forceOption = 2;
const speedOption = 3;
const vibrationOption = 4;
const commandOption = 5;

const GeneralConfigs = () => (
  <div className="App">
    <div style={{ marginTop: "6%", marginBottom: "2%" }}>
      <CalibrationUpload />
    </div>

    <div style={{ justifyContent: "center", display: "flex" }} />
  </div>
);

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: TabPadding }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    borderTopLeftRadius: theme.spacing.unit * borderRadius,
    borderBottomLeftRadius: theme.spacing.unit * borderRadius,
    borderTopRightRadius: theme.spacing.unit * borderRadius,
    borderBottomRightRadius: theme.spacing.unit * borderRadius,
    marginTop: "8%",
    marginLeft: "10%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center"
  }
});

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar color="inherit" className={classes.appBar} position="relative">
          <Tabs centered value={value} onChange={this.handleChange}>
            <Tab label="Gerais" />
            <Tab label="Temperatura" />
            <Tab label="Força" />
            <Tab label="Velocidade" />
            <Tab label="Vibração" />
            <Tab label="Comando" />
          </Tabs>
        </AppBar>
        {value === generalConfigsOption && GeneralConfigs()}
        {value === temperatureOption && <Temperature />}
        {value === forceOption && <Force />}
        {value === speedOption && <Speed />}
        {value === vibrationOption && <Vibration />}
        {value === commandOption && <Command />}
      </div>
    );
  }
}

Calibration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Calibration);
