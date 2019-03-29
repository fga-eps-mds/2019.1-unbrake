import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Equalizer, Assignment, Menu, Settings, ShowChart } from '@material-ui/icons';
import { BrowserRouter, Route } from 'react-router-dom'

import Index from './Index'
import Configuration from './Configuration'
import Calibration from './Calibration'
import Test from './Test'
import Analysis from './Analysis'
const drawerWidth = 240;


class SideBarMenu extends React.Component {
  state = {
    open: false,
    currentPage: ''
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  listMenu = (location, history) => {

  let list =  ['analysis', 'configuration', 'calibration', 'test'].map((text, index) => {
      var nome;
      let icon;
      switch (index){
        case 0:
          nome = 'Análise'
          icon = <Assignment />
          break;
        case 1:
          nome = 'Configuração'
          icon = <Settings />
          break;
        case 2:
          nome = 'Calibração'
          icon = <Equalizer />
          break;
        case 3:
          nome = 'Teste'
          icon = <ShowChart />
          break;
          default:
            nome = 'Index'
            break;
      }
      return (
        <React.Fragment>
          <ListItem button key={text} onClick={() => {
              const to = '/' + text;
              if (location.pathname !== to) {
                history.push(to);
              }
            }}
            selected={ '/'+text === location.pathname }>
            <ListItemIcon>{ icon }</ListItemIcon>
            <ListItemText primary={nome} />
          </ListItem>
        </React.Fragment>
          )}
        )
      return list;
      }

  render() {
      const { classes, theme } = this.props;
      const routes = []; // empty array
  // add elements with string keys
      routes['Análise'] = 'analysis';
      routes['Configuração'] = 'configuration';
      routes['Calibração'] = 'calibration';
      routes['Teste'] = 'test';

      return (
        <BrowserRouter>
          <Route render={({ location, history }) => (
            <React.Fragment>
              <div className={classes.root}>
                <CssBaseline />
                <AppBar
                  position="fixed"
                  className={classNames(classes.appBar, {
                    [classes.appBarShift]: this.state.open,
                  })}
                >
                  <Toolbar disableGutters={!this.state.open}>
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={this.handleDrawerOpen}
                      className={classNames(classes.menuButton, {
                        [classes.hide]: this.state.open,
                      })}
                    >
                      <Menu />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                      UnBrake
                    </Typography>
                  </Toolbar>
                </AppBar>
                <Drawer
                  variant="permanent"
                  className={classNames(classes.drawer, {
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                  })}
                  classes={{
                    paper: classNames({
                      [classes.drawerOpen]: this.state.open,
                      [classes.drawerClose]: !this.state.open,
                    }),
                  }}
                  open={this.state.open}
                >
                  <div className={classes.toolbar}>
                    <IconButton onClick={this.handleDrawerClose}>
                      {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                  </div>
                  <Divider />
                  <List >
                    {this.listMenu(location, history)}
                  </List>
                </Drawer>
                <main style={{flex: 1}}>
                  <Route path="/configuration" exact component={props => <Configuration />} />
                  <Route path="/analysis" component={props => <Analysis />} />
                  <Route path="/calibration" component={props => <Calibration />} />
                  <Route path="/test" component={props => <Test />} />
                </main>

              </div>
            </React.Fragment>
          )}
          />
        </BrowserRouter>
      );
    }
  }



  Index.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  const styles = theme => ({
    root: {
      display: 'flex',
    },
    appBar: {
      backgroundColor: '#8B0000',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing.unit * 7 + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing.unit * 9 + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
  }
  );


export default withStyles(styles, { withTheme: true })(SideBarMenu);
