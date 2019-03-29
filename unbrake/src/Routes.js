import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom'

import Index from './components/Login'
// import Configuration from './components/Configuration'
// import Calibration from './components/Calibration'
import Test from './components/Login'
// import Analysis from './components/Analysis'

export default props => (
  <BrowserRouter>
    <Route path='/' component={ Index }/>
    {/* <Route path='/configuration' component={ Configuration }/> */}
    {/* <Route path='/calibration' component={ Calibration }/> */}
    <Route path='/test' component={ Test }/>
    {/* <Route path='/analysis' component={ Analysis }/> */}
  </BrowserRouter>
)