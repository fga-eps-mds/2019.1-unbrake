import React from "react";
import "./App.css";
import RealTimeChart from "./components/RealTimeChart";

const data = [
  {
    Frenagem: 500,
    Velocidade: 3000,
    amt: 3000 // Ponto 1
  },
  {
    Frenagem: 2000,
    Velocidade: 2000,
    amt: 200
  },
  {
    Frenagem: 3000,
    Velocidade: 1000,
    amt: 2290
  }
  /**
   *{
   * cd:400, uv: 2780, pv: 3908, amt: 2000, Outros pontos
   * },
   * {
   * name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
   * },
   * {
   * name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
   * },
   * {
   * name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
   *},
   */
];
const App = () => {
  return (
    <RealTimeChart
      data={data}
      Y="Eixo Y"
      X="Eixo X"
      Label1="Frenagem"
      Label2="Velocidade"
    />
  );
};

export default App;
