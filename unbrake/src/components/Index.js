import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { Route, BrowserRouter, Router } from 'react-router-dom'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import Configuration from './Configuration'
import Calibration from './Calibration'
import Test from './Test'
import Analysis from './Analysis'

class Index extends Component {
  render() {
    return (
      <BrowserRouter>
    <Route render={({ location, history }) => (
        <React.Fragment>
            <SideNav
                onSelect={(selected) => {
                    const to = '/' + selected;
                    if (location.pathname !== to) {
                        history.push(to);
                    }
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="index">
                    <NavItem eventKey="index">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="configuration">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Configuration
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="analysis">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Analysis
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="calibration">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Calibration
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="test">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Test
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            <main>
                <Route path="/configuration" exact component={props => <Configuration />} />
                <Route path="/analysis" component={props => <Analysis />} />
                <Route path="/calibration" component={props => <Calibration />} />
                <Route path="/test" component={props => <Test />} />
            </main>
        </React.Fragment>
    )}
    />
</BrowserRouter>


           );
  }
}

export default Index;
