import React from "react";
import "./App.css";

import SideBarMenu from "./components/SideBarMenu";
import Routes from "./Routes";

const App = () => (
  <React.Fragment>
    <SideBarMenu />
    <Routes />
  </React.Fragment>
);

export default App;
