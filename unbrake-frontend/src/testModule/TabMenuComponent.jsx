import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import RealTimeChart from "../components/RealTimeChart";

const margin = 2.5;

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
    justifyContent: "center"
  }
});

class TabMenuComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
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
          {value === zeroTab && <h1>Formulário de Configuração</h1>}
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
};

export default withStyles(styles)(TabMenuComponent);
