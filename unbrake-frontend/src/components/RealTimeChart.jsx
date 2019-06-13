import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
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

const RealTimeChart = props => {
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
                    y: props.data[props.data.length - indexPadding].uv
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
};

RealTimeChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number))
};

RealTimeChart.defaultProps = {
  data: [
    {
      uv: 0
    }
  ]
};

export default RealTimeChart;
