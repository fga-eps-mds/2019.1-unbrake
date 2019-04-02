import React from "react";
import "./App.css";
// import RealTimeChart from "./components/RealTimeChart";

import SideBarMenu from "./components/SideBarMenu";
import Routes from "./Routes";

const App = () => (
  <React.Fragment>
    <SideBarMenu />
    <Routes />
  </React.Fragment>
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
