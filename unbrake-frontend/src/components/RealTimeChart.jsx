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

const sensorConfig = (label, color) => ({
  label: label,
  fill: false,
  cubicInterpolationMode: "monotone",
  backgroundColor: color,
  borderColor: color
});

const RealTimeChart = props => {
  return (
    <Line
      data={{
        datasets: [
          {
            ...sensorConfig(props.labelSensor1, props.colorSensor1),
            data: []
          },
          {
            ...sensorConfig(props.labelSensor2, props.colorSensor2),
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
          display: true
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
                  chart.data.datasets.forEach((dataset, index) => {
                    dataset.data.push({
                      x: Date.now(),
                      y: index ? props.sensor2[props.sensor2.length - indexPadding] : props.sensor1[props.sensor1.length - indexPadding]
                    });
                  })
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
  sensor1: PropTypes.arrayOf(PropTypes.number),
  sensor2: PropTypes.arrayOf(PropTypes.number)
};

RealTimeChart.defaultProps = {
  sensor1: [0],
  sensor2: [0]
};

export default RealTimeChart;
