import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducer/index'
import Routes from './Routes'

const store = createStore(reducers);

class App extends Component {
  render() {
    console.log(store);
    return (
      <Provider store = {store}>
        <Routes/>
      </Provider>

    );
  }
}

export default App;
