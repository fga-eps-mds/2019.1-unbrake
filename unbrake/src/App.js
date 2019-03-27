import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RealTimeChart from './component/RealTimeChart'


const data = [

  {
    Forca:1000, Velocidade: 3000, amt: 3000, //Ponto 1
  },
  {
    Forca:2000, Velocidade: 2000, amt: 200,
  },
  {
    Forca:3000, Velocidade: 1000, amt: 2290,
  },
  /**{
     cd:400, uv: 2780, pv: 3908, amt: 2000, Outros pontos
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },*/
];

export default class App extends React.Component {
  render() {
    return (
    	<center>
      		<RealTimeChart data = {data} Y = "Eixo Y" X = "Eixo X" Label1 = "Forca" Label2 = "Velocidade"/>

		</center>    
    );
  }
}

 
