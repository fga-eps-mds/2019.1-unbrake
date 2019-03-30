import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'


import Index from './components/Index'
import SideBarMenu from './components/SideBarMenu'
import Routes from './Routes'


class App extends Component {
  render(){
    return(
      <React.Fragment>
        <SideBarMenu />
        <Routes />
      </React.Fragment>
);}
}

export default App;
