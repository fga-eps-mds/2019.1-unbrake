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

import Configuration from "./Configuration";
import Calibration from "./Calibration";
// import Test from "./Test";
import Analysis from "./Analysis";
import Login from "./Login";
import SignUp from "./SignUp";

const drawerWidth = 240;
const drawerCloseWidth = 7;
const themeWidth = 9;
const flexGrowValue = 1;
const menuButtonLeft = 12;
const menuButtonRight = 36;
const flexShrinkValue = 0;
const optionsId = [
  "analysisId",
  "configurationId",
  "calibrationId",
  "signUpId"
];

const listMenu = (location, history) => {
  const list = ["analysis", "configuration", "calibration", "signup"].map(
    (text, index) => {
      let nome; // Fix this!!!
      let icon;
      switch (optionsId[index]) {
        case "analysisId":
          nome = "Análise";
          icon = <ShowChart />;
          break;
        case "configurationId":
          nome = "Configuração";
          icon = <Settings />;
          break;
        case "calibrationId":
          nome = "Calibração";
          icon = <Equalizer />;
          break;
        case "signUpId":
          nome = "Sign Up";
          icon = <Assignment />;
          break;
        default:
          nome = "";
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
            <ListItemText primary={nome} />
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
      <Button style={{ textTransform: "none" }} color="inherit" href="/">
        UnBrake
      </Button>
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
      <Route path="/configuration" component={() => <Configuration />} />
      <Route path="/analysis" component={() => <Analysis />} />
      <Route path="/calibration" component={() => <Calibration />} />
      <Route path="/singup" component={() => <SignUp />} />
      <Route path="/" component={() => <Login />} />
    </main>
  );
};

const SideBarMenu = class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleDrawerOpen = () => {
      this.setState({ open: true });
    };
    this.handleDrawerClose = () => {
      this.setState({ open: false });
    };
  }

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    return (
      <BrowserRouter>
        <Route
          render={({ location, history }) => (
            <React.Fragment>
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
            </React.Fragment>
          )}
        />
      </BrowserRouter>
    );
  }
};

SideBarMenu.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  theme: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object
  ]).isRequired
};
const appBar = theme => ({
  backgroundColor: "#8B0000",
  zIndex: theme.zIndex.drawer + flexGrowValue,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  })
});

const appBarShift = theme => ({
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  })
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
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
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

export default withStyles(styles, { withTheme: true })(SideBarMenu);
