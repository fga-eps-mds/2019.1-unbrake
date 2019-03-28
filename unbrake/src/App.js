import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './components/Login.js';
import './App.css';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducer/index'

const store = createStore(reducers);

class App extends Component {
  render() {
    console.log(store);
    return (
      <Provider store = {store}>
        <Login/>
      </Provider>
      
    );
  }
}

export default App;
