import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    A:500, V: 1000, F: 2000, amt: 3000, //Ponto A
  },
  {
    A:600, V: 2000, F: 100, amt: 200,
  },
  {
    A:400, V: 2000, F: 9800, amt: 2290,
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

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

  render() {
    return (
    	
      	<LineChart
		    width={600}
		    height={300}
		    data={data}
		    margin={{
		        top: 8, right: 5, left: 5, bottom: 5,
        		}}
      	>
      	

        <CartesianGrid strokeDasharray="2 3" />
        <XAxis dataKey="name" label={{ value: "Axis X", position: 'insideBottomRight', offset: -5 }} />
        <YAxis label={{ value: "Axis Y", angle: -90, position: 'insideLeft' }}/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="F" stroke="#FF1493" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="V" stroke="	#FF8C69" />
        <Line type="monotone" dataKey="A" stroke="#7FFFD4"/>
      </LineChart>

    );
  }
}
