import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducer/index";
import Routes from "./Routes";

const store = createStore(reducers);

const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

export default App;
