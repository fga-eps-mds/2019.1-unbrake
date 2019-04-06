import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducer/index";
// import RealTimeChart from "./components/RealTimeChart";

import SideBarMenu from "./components/SideBarMenu";
import Routes from "./Routes";

const store = createStore(reducers);

const App = () => (
  <Provider store={store}>
    <React.Fragment>
      <SideBarMenu />
      <Routes />
    </React.Fragment>
  </Provider>
);

/*
 *    <RealTimeChart
 *      data={data}
 *      Y="Eixo Y"
 *      X="Eixo X"
 *      Label1="Frenagem"
 *      Label2="Velocidade"
 *    />
 *
 */

export default App;
