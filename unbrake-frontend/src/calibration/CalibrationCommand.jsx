import React from "react";
import "../App.css";
import { Field, reduxForm } from "redux-form";
import { TextField, withStyles } from "@material-ui/core";
import CalibrationCheck from "./CalibrationTempCheck";
import RealTimeChart from "../components/RealTimeChart";

const styles = () => ({
  grid: {
    margin: "5px"
  },
  div: {
    marginTop: "5px",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center"
  }
});

const defineCredentials = type => {
  let name;
  let label;
  let unity;
  switch (type) {
    case "speed":
      name = "speed";
      label = "Velocidade";
      unity = "(Km/h)";
      break;
    default:
      name = "pression";
      label = "Pressão";
      unity = "(Bar)";
      break;
  }
  return { name, label, unity };
};

const generateDictionary = (atribute, type) => {
  const { max, actual, chanel, command, cycle } = atribute;
  const { name, label, unity } = defineCredentials(type);
  const dictionary = {
    name,
    label,
    unity,
    max,
    actual,
    chanel,
    command,
    cycle
  };

  return dictionary;
};

const renderFields = (name, label, operations) => (
  <div className={styles.div}>
    <Field
      style={{ margin: "5px" }}
      name={name}
      component={TextField}
      label={label}
      placeholder={label}
      variant="outlined"
      value={operations.value}
      onChange={operations.handleChange}
    />
  </div>
);
const renderAllFields = (dictionary, handleChange) => {
  const { name, label, unity } = dictionary;
  const operationsChanel = { handleChange, value: dictionary.chanel };
  const operationsActual = { handleChange, value: dictionary.actual };
  const operationsMax = { handleChange, value: dictionary.max };
  const operationsCycle = { handleChange, value: dictionary.cycle };
  const operationsCommand = { handleChange, value: dictionary.command };
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-evenly"
      }}
    >
      {renderFields(`${name}Chanel`, "Canal - comando", operationsChanel)}
      {renderFields(`${name}`, `${label} ${unity}`, operationsActual)}
      {renderFields(`${name}Max`, `${label} máxima ${unity}`, operationsMax)}
      {renderFields(`${name}Cycle`, `${label} (Duty Cycle)`, operationsCycle)}
      {renderFields(
        `${name}Command`,
        `${label} - comando (mV)`,
        operationsCommand
      )}
    </div>
  );
};
class CalibrationCommand extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      calibrationCommand: {
        speed: {
          chanel: "",
          actual: "",
          max: "",
          command: "",
          cycle: ""
        },
        pression: {
          chanel: "",
          max: "",
          command: "",
          actual: "",
          cycle: ""
        }
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const command = { [event.target.name]: target.value };
    this.setState(prevState => ({
      calibrationCommand: { ...prevState.calibrationCommand, command }
    }));
  }

  render() {
    const { calibrationCommand } = this.state;
    const { speed, pression } = calibrationCommand;

    const speedDictionary = generateDictionary(speed, "speed");
    const pressionDictionary = generateDictionary(pression, "pression");

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: "6%", marginBottom: "2%" }}>
          <div
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-evenly"
            }}
          >
            {renderAllFields(speedDictionary, this.handleChange)}
            {renderAllFields(pressionDictionary, this.handleChange)}
            <div
              style={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "space-evenly",
                marginLeft: "3%"
              }}
            >
              <CalibrationCheck graphicType="velocidade" checkID="1" />
              <CalibrationCheck graphicType="pressão" checkID="2" />
            </div>
          </div>
        </div>

        <div style={{ justifyContent: "center", display: "flex" }}>
          <RealTimeChart />
        </div>
      </div>
    );
  }
}

const CalibrationForm = reduxForm({
  form: "calibration"
})(CalibrationCommand);

export default withStyles(styles)(CalibrationForm);
