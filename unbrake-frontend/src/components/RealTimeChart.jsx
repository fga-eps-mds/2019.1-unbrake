import React from "react";
import { Line } from "react-chartjs-2";

import "chartjs-plugin-streaming";
import io from "socket.io-client";

const indexPadding = 1;
const yAxesOptions = () => [
  {
    scaleLabel: {
      display: true,
      labelString: "mv"
    },
    ticks: {
      max: 5,
      min: 1,
      stepSize: 0.5
    }
  }
];

const chartOptions = (yValue, yAxes) => {
  return {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          maxBarThickness: 3,
          gridLines: {
            display: true
          },
          realtime: {
            duration: 20000,
            delay: 1000,
            refresh: 3000,
            onRefresh: chart => {
              chart.data.datasets[0].data.push({
                x: Date.now(),
                y: yValue
              });
            }
          }
        }
      ],
      yAxes
    },
    tooltips: {
      enabled: false,
      mode: "nearest",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: false
    }
  };
};

class RealTimeChart extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:5000/test");
    this.a = [{ uv: 1 }];
  }

  componentDidMount() {
    /*
     *setInterval(() => this.forceUpdate(), 1000);
     *this.socket.on('connect', function(){console.log("oi")});
     */
  }

  render() {
    this.socket.on("bla", data => {
      this.a.push(data);
    });
    return (
      <Line
        data={{
          datasets: [
            {
              label: "Depth",
              fill: false,
              cubicInterpolationMode: "monotone",
              backgroundColor: "#305c8a",
              borderColor: "#305c8a",
              data: []
            }
          ]
        }}
        options={chartOptions(
          this.a[this.a.length - indexPadding].uv,
          yAxesOptions
        )}
      />
    );
  }
}

export default RealTimeChart;
