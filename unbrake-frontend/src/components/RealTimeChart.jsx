import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";

const indexPadding = 1;

const sensorInitialValue = -1;

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
  label,
  fill: false,
  cubicInterpolationMode: "monotone",
  backgroundColor: color,
  borderColor: color
});

const datasets = props => {
  const {
    labelSensor1,
    labelSensor2,
    colorSensor1,
    colorSensor2,
    sensor2
  } = props;
  if (sensor2[0] === sensorInitialValue) {
    return {
      datasets: [
        {
          ...sensorConfig(labelSensor1, colorSensor1),
          data: []
        }
      ]
    };
  }
  return {
    datasets: [
      {
        ...sensorConfig(labelSensor1, colorSensor1),
        data: []
      },
      {
        ...sensorConfig(labelSensor2, colorSensor2),
        data: []
      }
    ]
  };
};
class RealTimeChart extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { sensor1, sensor2 } = this.props;
    return (
      <Line
        data={datasets(this.props)}
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
                        y: index
                          ? sensor2[sensor2.length - indexPadding]
                          : sensor1[sensor1.length - indexPadding]
                      });
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

RealTimeChart.propTypes = {
  sensor1: PropTypes.arrayOf(PropTypes.number),
  sensor2: PropTypes.arrayOf(PropTypes.number)
};

RealTimeChart.defaultProps = {
  sensor1: [sensorInitialValue],
  sensor2: [sensorInitialValue]
};

export default RealTimeChart;
