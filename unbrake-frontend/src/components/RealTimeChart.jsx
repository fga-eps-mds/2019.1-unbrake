import React from "react";
import { Line } from "react-chartjs-2";

import "chartjs-plugin-streaming";
import io from "socket.io-client";

const indexPadding = 1;

const yAxesConfig = () => [
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

const tooltipsConfig = () => ({
  enabled: false,
  mode: "nearest",
  intersect: false
});

const datasetsConfig = () => ({
  label: "Depth",
  fill: false,
  cubicInterpolationMode: "monotone",
  backgroundColor: "#305c8a",
  borderColor: "#305c8a"
});

class RealTimeChart extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:5000/test");
    this.data = [{ uv: 0 }];
  }

  componentDidMount() {
    /*
     *setInterval(() => this.forceUpdate(), 1000);
     *this.socket.on('connect', function(){console.log("oi")});
     */
  }

  render() {
    this.socket.on("temperature", newdata => {
      this.data.push(newdata);
    });
    return (
      <Line
        data={{
          datasets: [
            {
              ...datasetsConfig(),
              data: []
            }
          ]
        }}
        options={{
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
                  refresh: 1000,
                  onRefresh: chart => {
                    chart.data.datasets[0].data.push({
                      x: Date.now(),
                      y: this.data[this.data.length - indexPadding].uv
                    });
                  }
                }
              }
            ],
            yAxes: yAxesConfig()
          },
          tooltips: tooltipsConfig()
        }}
      />
    );
  }
}

export default RealTimeChart;
