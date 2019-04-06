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
import Test from "./Test";
import Analysis from "./Analysis";

const drawerWidth = 240;
const ZERO = 0;
const UM = 1;
const DOIS = 2;
const TRES = 3;
const SETE = 7;
const NOVE = 9;
const DOZE = 12;
const TRINTA_SEIS = 36;

const listMenu = (location, history) => {
  const list = ["analysis", "configuration", "calibration", "test"].map(
    (text, index) => {
      let nome;
      let icon;
      switch (index) {
        case ZERO:
          nome = "Análise";
          icon = <ShowChart />;
          break;
        case UM:
          nome = "Configuração";
          icon = <Settings />;
          break;
        case DOIS:
          nome = "Calibração";
          icon = <Equalizer />;
          break;
        case TRES:
          nome = "Teste";
          icon = <Assignment />;
          break;
        default:
          nome = "Index";
          break;
      }
      return (
        <React.Fragment>
          <ListItem
            button
            key={text}
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
      <Button
        style={{ "text-transform": "none" }}
        color="inherit"
        href="/index"
      >
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
    <main style={{ flex: 1 }}>
      <Route path="/configuration" component={() => <Configuration />} />
      <Route path="/analysis" component={() => <Analysis />} />
      <Route path="/calibration" component={() => <Calibration />} />
      <Route path="/test" component={() => <Test />} />
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
  theme: PropTypes.objectOf(PropTypes.string).isRequired
};
const appBar = theme => ({
  backgroundColor: "#8B0000",
  zIndex: theme.zIndex.drawer + UM,
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
    marginLeft: DOZE,
    marginRight: TRINTA_SEIS
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: ZERO,
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
    width: theme.spacing.unit * SETE + UM,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * NOVE + UM
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
    flexGrow: UM,
    padding: theme.spacing.unit * TRES
  }
});

export default withStyles(styles, { withTheme: true })(SideBarMenu);
