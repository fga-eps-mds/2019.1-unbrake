import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
  renderGraphic1(Label1) {
    const { graphic1 } = this.props;
    if (graphic1)
      return (
        <Line
          type="monotone"
          dataKey={Label1}
          stroke="#FF1493"
          activeDot={{ r: 8 }}
        />
      );

    return null;
  }

  renderGraphic2(Label2) {
    const { graphic2 } = this.props;

    if (graphic2)
      return <Line type="monotone" dataKey={Label2} stroke=" #FF8C69" />;

    return null;
  }

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
        {this.renderGraphic1(Label1)}
        {this.renderGraphic2(Label2)}
      </LineChart>
    );
  }
}
RealTimeChart.propTypes = {
  data: PropTypes.instanceOf(Array),
  X: PropTypes.string,
  Y: PropTypes.string,
  Label1: PropTypes.string,
  Label2: PropTypes.string,
  graphic1: PropTypes.bool,
  graphic2: PropTypes.bool
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
  Label2: "Velocidade",
  graphic1: false,
  graphic2: false
};

const mapStateToProps = state => ({
  graphic1: state.configReducer.graphic1,
  graphic2: state.configReducer.graphic2
});

export default connect(
  mapStateToProps,
  {}
)(RealTimeChart);
