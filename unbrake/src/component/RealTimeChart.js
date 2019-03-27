import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


export default class RealTimeChart extends React.Component {

  render() {
    return (
    	
      	<LineChart
		    width={600}
		    height={300}
		    data={this.props.data}
		    margin={{
		        top: 8, right: 5, left: 5, bottom: 5,
        		}}
      	>
      	
        <CartesianGrid strokeDasharray="2 3" />
        <XAxis dataKey="name" label={{ value: this.props.X, position: 'insideBottomRight', offset: -5 }} />
        <YAxis label={{ value: this.props.Y, angle: -90, position: 'insideLeft' }}/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey= {this.props.Label1} stroke="#FF1493" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey= {this.props.Label2} stroke="	#FF8C69" />
      </LineChart>

    );
  }
}
