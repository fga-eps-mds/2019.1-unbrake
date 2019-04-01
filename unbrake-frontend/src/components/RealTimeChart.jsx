import React from "react";
import PropTypes from "prop-types";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

class RealTimeChart extends React.PureComponent {
  render() {
    const { data, X, Y, Label1, Label2 } = this.props;
    return (
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 8,
          right: 5,
          left: 5,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="2 3" />
        <XAxis
          dataKey="name"
          label={{
            value: X,
            position: "insideBottomRight",
            offset: -5
          }}
        />
        <YAxis label={{ value: Y, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={Label1}
          stroke="#FF1493"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey={Label2} stroke=" #FF8C69" />
      </LineChart>
    );
  }
}
RealTimeChart.propTypes = {
  data: PropTypes.instanceOf(Array),
  X: PropTypes.string,
  Y: PropTypes.string,
  Label1: PropTypes.string,
  Label2: PropTypes.string
};
RealTimeChart.defaultProps = {
  data: [
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
  ],
  X: "Eixo X",
  Y: "Eixo Y",
  Label1: "Frenagem",
  Label2: "Velocidade"
};

export default RealTimeChart;
