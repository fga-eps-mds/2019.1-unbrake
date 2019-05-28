import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from "@material-ui/core";
import {
  ChevronLeft,
  ChevronRight,
  Equalizer,
  Assignment,
  Menu,
  Settings,
  ShowChart
} from "@material-ui/icons";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";

import Configuration from "../Configuration/Configuration";
import Calibration from "./Calibration/Calibration";
import Analysis from "./Analysis";
import UserOptionsMenu from "./UserOptionsMenu";
import Vibration from "./Calibration/Vibration";
import Force from "./Calibration/Force";
import Test from "../testModule/TestComponent";

const drawerWidth = 240;
const drawerCloseWidth = 7;
const themeWidth = 9;
const flexGrowValue = 1;
const menuButtonLeft = 12;
const menuButtonRight = 36;
const flexShrinkValue = 0;
const optionsId = ["analysisId", "configurationId", "calibrationId", "testId"];

const listMenu = (location, history) => {
  const list = ["analysis", "configuration", "calibration", "test"].map(
    (text, index) => {
      let name;
      let icon;
      switch (optionsId[index]) {
        case "analysisId":
          name = "Análise";
          icon = <ShowChart />;
          break;
        case "configurationId":
          name = "Configuração";
          icon = <Settings />;
          break;
        case "calibrationId":
          name = "Calibração";
          icon = <Equalizer />;
          break;
        case "testId":
          name = "Ensaio";
          icon = <Assignment />;
          break;
        default:
          name = "";
          break;
      }
      return (
        <React.Fragment key={text}>
          <ListItem
            button
            onClick={() => {
              const to = `/${text}`;
              if (location.pathname !== to) {
                history.push(to);
              }
            }}
            selected={location.pathname === `/+${text}`}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        </React.Fragment>
      );
    }
  );
  return list;
};

const ToolBar = (classes, open, handleDrawerOpen) => {
  return (
    <Toolbar disableGutters={!open}>
      <IconButton
        color="inherit"
        aria-label="Open drawer"
        onClick={handleDrawerOpen}
        className={classNames(classes.menuButton, {
          [classes.hide]: open
        })}
      >
        <Menu />
      </IconButton>
      <div
        style={{ justifyContent: "space-between", flex: 1, display: "flex" }}
      >
        <Button style={{ textTransform: "none" }} color="inherit" href="/">
          UnBrake
        </Button>
        <UserOptionsMenu />
      </div>
    </Toolbar>
  );
};

const IconButtons = (classes, handleDrawerClose, theme) => {
  return (
    <div className={classes.toolbar}>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </div>
  );
};

const RouteLogic = () => {
  return (
    <main style={{ flex: flexGrowValue }}>
      <Route exact path="/configuration" component={() => <Configuration />} />
      <Route exact path="/analysis" component={() => <Analysis />} />
      <Route exact path="/calibration" component={() => <Calibration />} />
      <Route exact path="/test" component={() => <Test />} />
      <Route exact path="/vibration" component={() => <Vibration />} />
      <Route exact path="/force" component={() => <Force />} />
    </main>
  );
};

const SideBarMenu = class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      authenticated: false,
      loading: true
    };
    this.handleDrawerOpen = () => {
      this.setState({ open: true });
    };
    this.handleDrawerClose = () => {
      this.setState({ open: false });
    };
  }

  render() {
    const { classes, theme, loadingVerifyingAuth } = this.props;
    const { open } = this.state;

    return (
      <BrowserRouter>
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              {loadingVerifyingAuth && (
                <div className={classes.root}>
                  <CssBaseline />
                  <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                      [classes.appBarShift]: open
                    })}
                  >
                    {ToolBar(classes, open, this.handleDrawerOpen)}
                  </AppBar>
                  <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                      [classes.drawerOpen]: open,
                      [classes.drawerClose]: !open
                    })}
                    classes={{
                      paper: classNames({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                      })
                    }}
                    open={open}
                  >
                    {IconButtons(classes, this.handleDrawerClose, theme)}
                    <Divider />
                    <List>{listMenu(location, history)}</List>
                  </Drawer>
                  {RouteLogic()}
                </div>
              )}
            </React.Fragment>
          )}
        />
      </BrowserRouter>
    );
  }
};

const appBarTransition = (theme, duration) =>
  theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration
  });
const drawerTransition = (theme, duration) =>
  theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration
  });

SideBarMenu.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  theme: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  loadingVerifyingAuth: PropTypes.bool.isRequired
};
const appBar = theme => ({
  backgroundColor: "#8B0000",
  zIndex: theme.zIndex.drawer + flexGrowValue,
  transition: appBarTransition(theme, theme.transitions.duration.leavingScreen)
});

const appBarShift = theme => ({
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
  transition: appBarTransition(theme, theme.transitions.duration.enteringScreen)
});

const mapStateToProps = state => ({
  loadingVerifyingAuth: state.authReducer.loadingVerifyingAuth
});

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: appBar(theme),
  appBarShift: appBarShift(theme),
  menuButton: {
    marginLeft: menuButtonLeft,
    marginRight: menuButtonRight
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: flexShrinkValue,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: drawerTransition(
      theme,
      theme.transitions.duration.enteringScreen
    )
  },
  drawerClose: {
    transition: drawerTransition(
      theme,
      theme.transitions.duration.leavingScreen
    ),
    overflowX: "hidden",
    width: theme.spacing.unit * drawerCloseWidth + flexGrowValue,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * themeWidth + flexGrowValue
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: flexGrowValue,
    padding: theme.spacing.unit + theme.spacing.unit + theme.spacing.unit
  }
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(SideBarMenu)
);
