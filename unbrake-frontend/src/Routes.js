import React, { Component } from 'react';
import './App.css';
import { Route, BrowserRouter } from 'react-router-dom'

import Login from './components/Login'
// import Configuration from './components/Configuration'
// import Calibration from './components/Calibration'
// import Test from './components/Test'
// import Analysis from './components/Analysis'

export default props => (
  <BrowserRouter>
    <Route path='/' component={ Login }/>
    {/* <Route path='/configuration' component={ Configuration }/> */}
    {/* <Route path='/calibration' component={ Calibration }/> */}
    {/* <Route path='/test' component={ Test }/> */}
    {/* <Route path='/analysis' component={ Analysis }/> */}
  </BrowserRouter>
)