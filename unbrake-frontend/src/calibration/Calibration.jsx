import React from "react";
import "../App.css";
import RealTimeChart from "../components/RealTimeChart";
import MyForm from "./CalibrationTempForm";
import Vibration from "./Vibration";
import CalibrationUpload from "./CalibrationUpload";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


const bla = () => (
  <div className="App">
    <div style={{ marginTop: "6%", marginBottom: "2%" }}>
      <CalibrationUpload />
    </div>

    <div style={{ justifyContent: "center", display: "flex" }}>
    </div>
  </div>
);


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    borderTopLeftRadius: theme.spacing.unit * 2.5,
    borderBottomLeftRadius: theme.spacing.unit * 2.5,
    borderTopRightRadius: theme.spacing.unit * 2.5,
    borderBottomRightRadius: theme.spacing.unit * 2.5,
    marginTop: "8%",
    marginLeft: "10%",
    width: "80%",
    alignItems: 'center',
    justifyContent: 'center'
  }

});

class Calibration extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
          <AppBar color="inherit" className={classes.appBar} position="relative">
          <Tabs centered value={value} onChange={this.handleChange}>
            <Tab label="Gerais" />
            <Tab label="Temperatura" />
            <Tab label="Vibração" />
          </Tabs>
        </AppBar>
        {value === 0 && bla()}
        {value === 1 && <MyForm/ >}
        {value === 2 && <Vibration />}
      </div>
    );
  }
}


export default withStyles(styles)(Calibration);
