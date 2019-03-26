import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sum from './component/Sum';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Reducer from './reducers/index';
import SimpleLineChart from './component/realtimechat'


export default class App extends React.Component {
  render() {
    return (
    	<center>
      		<SimpleLineChart/>

		</center>    
    );
  }
}

