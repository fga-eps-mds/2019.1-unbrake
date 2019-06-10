import React from "react";
import { connect } from "react-redux";
import "../App.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
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

const validateCalibration = calibration => {
  if (Object.values(calibration).length) {
    return Object.values(calibration).every(x => x !== "");
  }
  return false;
};

/*
 *const getEmptyFields = (calibration) => {
 *  if(Object.values(calibration).length){
 *    return Object.keys(calibration).every(k => (calibration[k] === "" ? k:null))
 *  }
 *  return []
 *}
 */

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  handleSubmit() {
    const { calibration } = this.props;
    const { calibrationValues } = calibration.values;
    validateCalibration(calibrationValues);
    /*
     * Se estiver correto, submete a calibração e exibe a notificação verde
     * Case contrário, mostra a notificação mostrando os campos que estão
     * vazios
     */
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <div className={classes.root}>
          <AppBar
            color="inherit"
            className={classes.appBar}
            position="relative"
          >
            <Tabs centered value={value} onChange={this.handleChange}>
              <Tab label="Gerais" />
              <Tab label="Temperatura" />
              <Tab label="Força" />
              <Tab label="Velocidade" />
              <Tab label="Vibração" />
              <Tab label="Comando" />
            </Tabs>
            <Button onClick={this.handleSubmit}>Cadastrar</Button>
          </AppBar>
          {value === generalConfigsOption && GeneralConfigs()}
          {value === temperatureOption && <Temperature />}
          {value === forceOption && <Force />}
          {value === speedOption && <Speed />}
          {value === vibrationOption && <Vibration />}
          {value === commandOption && <Command />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    calibration: state.form.calibration
  };
}

Calibration.defaultProps = {
  calibration: { values: {} }
};

Calibration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  calibration: PropTypes.objectOf(PropTypes.string)
};

export default connect(mapStateToProps)(withStyles(styles)(Calibration));
