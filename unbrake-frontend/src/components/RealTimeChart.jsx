import React from "react";
import { Line } from "react-chartjs-2";
import * as emitter from "emitter-io";
import "chartjs-plugin-streaming";

const indexPadding = 1;

const yAxesConfig = () => [
  {
    scaleLabel: {
      display: true,
      labelString: "mv"
    },
    ticks: {
      max: 500,
      min: 1,
      stepSize: 50
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
    this.client = emitter.connect({
      host: "host",
      port: 8080,
      secure: false
    });
    this.client.subscribe({
      key: "key",
      channel: "unbrake"
    });
    this.data = [{ uv: 0 }];
  }

  componentDidMount() {
    const scope = this;
    this.client.on("message", msg => {
      scope.data.push({ uv: parseInt(msg.asString(), 10) });
    });
  }

  render() {
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
                  refresh: 500,
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
