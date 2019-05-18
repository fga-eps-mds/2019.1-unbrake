import React from "react";
import "../App.css";
import { initialize, reduxForm, Field } from "redux-form";
import { TextField, Checkbox } from "redux-form-material-ui";
import { withStyles } from "@material-ui/core";
import CalibrationCheck from "./CalibrationTempCheck";
import { API_URL_GRAPHQL } from "../utils/Constants";
import { Button, FormControlLabel, Grid } from "@material-ui/core";


const validate = values => {
  const errors = {};
  const requiredFields = ["CHT1", "FCT1", "OFT1", "CHT2", "FCT2", "OFT2"];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Campo obrigatório";
    }
  });
  return errors;
};
const styles = () => ({
  grid: {
    margin: "5px"
  },
  div: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center"
  },
  grid: {
    padding: "px"
  }
});

async function submit(values, state) {
  const { calibration } = state;
  const { CHT1, FCT1, OFT1, CHT2, FCT2, OFT2 } = calibration;
  const url = `${API_URL_GRAPHQL}?query=mutation{createCalibrationTemperature(conversionFactor:${FCT1},temperatureOffset:${OFT1}){CalibrationTemperature{conversionFactor,temperatureOffset}}}`;

  // conversionFactor2:${FCT2},temperatureOffset2:${OFT2}

  const method = "POST";

  const response = await Request(url, method);

  return response;
}

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calibration: {
        CALIBRA_TEMPERATURA: {
          CHT1: "",
          FCT1: "",
          OFT1: "",
          CHT2: "",
          FCT2: "",
          OFT2: ""
        }
      }
    };

    this.handleChange = this.handleChange.bind(this);
  }

  renderFields(name, label) {
    const { classes } = this.props;
    return (
      <Grid item xs={6} className={classes.grid}>
        <Field
          className={classes.grid}
          name={name}
          component={TextField}
          label={label}
          placeholder={label}
          variant="outlined"
          // disabled="false"
        />
      </Grid>
    );
  }

  shouldComponentUpdate(nextProps) {
    const { calibration } = this.props;
    console.log(calibration);
    if (calibration !== nextProps.calibration) {
      const rightCalib = Object.assign({}, nextProps.calibration);

      const { dispatch } = this.props;
      dispatch(initialize("myForm", rightCalib.CALIBRA_TEMPERATURA));
      this.setState({ calibration: rightCalib.CALIBRA_TEMPERATURA });
      return true;
    }
    return false;
  }

  handleChange(event) {
    const calibration = {};
    const { name, value } = event.target;
    calibration[name] = value;
    this.setState(prevState => ({
      calibration: { ...prevState.calibration, ...calibration }
    }));
  }

  render() {
    console.log("state", this.state);
    console.log("props", this.props);
    const { calibration } = this.state;
    //Aumentar o tamanho dos campos
    return (
      <form>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-evenly"
          }}
        >
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-evenly",
              flex: 2
            }}
          />
          <div>
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="center"
            >
            {this.renderFields("CHT1", "Canal de aquisição 1")}
            {this.renderFields("CHT2", "Canal de aquisição 2")}
            </Grid>

            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="center"
            >
            {this.renderFields(`temperature_field1`, `Temperatura 1 (mV)`)}
            {this.renderFields(`temperature_field2`, `Temperatura 2 (mV)`)}
            </Grid>

            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="center"
            >
            {this.renderFields("FCT1", "Fator de conversão 1")}
            {this.renderFields("FCT2", "Fator de conversão 2")}
            </Grid>

            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="center"
            >
            {this.renderFields("OFT1", "Offset de Temperatura 1")}
            {this.renderFields("OFT2", "Offset de Temperatura 2")}
            </Grid>

            <Grid
              container
              item
              xs={12}
              alignItems="center"
              justify="center"
            >
            {this.renderFields(
              `Temperatura_field1_C`,
              `Temperatura 1 (°C)`
            )}
            {this.renderFields(
              `temperature_field2_C`,
              `Temperatura 1 (°C)`
            )}
            </Grid>

          </div>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "space-evenly",
              marginLeft: "3%",
              flex: 1
            }}
          >
            <CalibrationCheck checkID="1" />
            <CalibrationCheck checkID="2" />
          </div>
        </div>
      </form>
    );
  }
}
// Decorate with redux-form
const formExportation = reduxForm({
  form: "myForm",
  validate
})(MyForm);

export default withStyles(styles)(formExportation);
