import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'


import Index from './components/Index'
import SideBarMenu from './components/SideBarMenu'


class App extends Component {
  render(){
    return(
      <React.Fragment>
        <SideBarMenu />
        <BrowserRouter>
          <Route path='/' component={ Index }/>
        </BrowserRouter>

  </React.Fragment>
);}
}

export default App;
