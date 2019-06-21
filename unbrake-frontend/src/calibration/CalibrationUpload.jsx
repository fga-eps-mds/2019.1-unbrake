import React from "react";
import iniparser from "iniparser";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { initialize, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { addFile } from "../actions/FileActions";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";
import {
  createQuery,
  allVariablesCalib,
  calibrationJSON,
  empty,
  fieldsDisabledes,
  styles
} from "./CalibrationVariables";
import { messageSistem } from "../actions/NotificationActions";
import { changeCalibTest } from "../actions/TestActions";

const positionVector = 1;
const invalidId = 0;

const createCalibration = (data, dispatch) => {
  const nextPosition = 1;

  const cont = { calibrationtemperatureSet: -1, calibrationforceSet: -1 };

  const newCalibraiton = calibrationJSON.reduce(
    (prevDicionary, calibJSON, index) => {
      if (
        calibJSON === "calibrationtemperatureSet" ||
        calibJSON === "calibrationforceSet"
      )
        cont[calibJSON] += nextPosition;

      return allVariablesCalib[index].reduce((prevDictionaryTwo, variables) => {
        let subDictionay;

        if (
          calibJSON === "calibrationtemperatureSet" ||
          calibJSON === "calibrationforceSet"
        )
          subDictionay = {
            [variables.front]: data[calibJSON][cont[calibJSON]][variables.back]
          };
        else
          subDictionay = { [variables.front]: data[calibJSON][variables.back] };

        return { ...prevDictionaryTwo, ...subDictionay };
      }, prevDicionary);
    },
    {}
  );
  dispatch(initialize("calibration", newCalibraiton));
};

export const getSelectCalibration = (id, dispatch, sendMessage) => {
  let message = "";

  const query = createQuery();
  const url = `${API_URL_GRAPHQL}?query=query{calibration(id:${id}){${query}}}`;

  const method = "GET";

  Request(url, method).then(response => {
    if (response.errors === undefined) {
      const data = response.data.calibration;

      if (data.isDefault === true)
        message = "Calibração padrão carregada com sucesso";
      else message = `Calibração "${data.name}" carregada com sucesso`;

      sendMessage({
        message,
        variante: "success",
        condition: true
      });

      createCalibration(data, dispatch);
    } else {
      message = "Falha ao carregar calibração";
      sendMessage({
        message,
        variante: "error",
        condition: true
      });
    }
  });
};

export const itensSelection = allCalibration => {
  let allCalib = [{ id: 0, name: "" }];

  let notDefaultCalib;
  if (allCalibration !== "")
    notDefaultCalib = allCalibration.filter(calibration => {
      return calibration.isDefault === false && calibration.name !== "";
    });

  if (allCalibration !== "") allCalib = allCalib.concat(notDefaultCalib);

  const itens = allCalib.map(value => {
    return (
      <MenuItem key={value.name + value.id} value={value.id}>
        {value.name}
      </MenuItem>
    );
  });
  return itens;
};

const selectCalibration = (handleChange, calibStates, classes) => {
  return (
    <Grid item xs={4} className={classes.title}>
      <TextField
        id="outlined-select-currency"
        select
        label="Calibrações"
        value={calibStates.calibId}
        onChange={handleChange}
        name="dataBaseCalibration"
        className={classes.formControl}
        margin="normal"
        variant="outlined"
      >
        {itensSelection(calibStates.allCalibration)}
      </TextField>
    </Grid>
  );
};

const defaultButton = handleUpDefault => {
  return (
    <Button onClick={handleUpDefault} color="secondary" variant="contained">
      Calibração Padrão
    </Button>
  );
};

class CalibrationUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCalibration: ""
    };

    this.fileUpload = this.fileUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpDefault = this.handleUpDefault.bind(this);
  }

  componentDidMount() {
    const { dispatch, calibId, sendMessage, calibration } = this.props;

    const url = `${API_URL_GRAPHQL}?query=query{allCalibration{id, name, isDefault}}`;
    const method = "GET";
    Request(url, method).then(json => {
      const data = json.data.allCalibration;
      if (data !== null) {
        this.setState({ allCalibration: data });
      }
    });

    if (Object.keys(calibration.values).length === empty)
      dispatch(initialize("calibration", fieldsDisabledes));

    if (calibId > invalidId) {
      getSelectCalibration(calibId, dispatch, sendMessage);
    }
  }

  handleChange(event) {
    const { dispatch, sendMessage, changeCalib } = this.props;
    const { target } = event;

    const idSelect = target.value === invalidId ? "" : target.value;

    changeCalib({ calibId: idSelect });

    if (
      event.target.name === "dataBaseCalibration" &&
      event.target.value > invalidId
    )
      getSelectCalibration(event.target.value, dispatch, sendMessage);
  }

  handleUpDefault() {
    const { dispatch, sendMessage, changeCalib } = this.props;
    const { allCalibration } = this.state;

    if (allCalibration === "") return;
    const defaultsCalib = allCalibration.filter(calibration => {
      return calibration.isDefault === true;
    });
    if (defaultsCalib.length > empty) {
      const position = defaultsCalib.length - positionVector;
      const { id } = defaultsCalib[position];

      changeCalib({ calibId: id });
      getSelectCalibration(id, dispatch, sendMessage);
    }
  }

  uploadField(field, filename) {
    const { classes } = this.props;

    let archive;

    if (field === "calibration") archive = "Calibração";

    return (
      <Grid container item xs={10} alignItems="center" justify="center">
        <Grid item xs={4} className={classes.title}>
          <h2 justify="left">Upload arquivo de {archive}</h2>
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <label htmlFor="contained-button-file">
            <input
              id="contained-button-file"
              type="file"
              name={field}
              className={classes.input}
              onChange={e => this.fileUpload(e.target.files[0], field)}
            />
            <Paper className={classes.rootUploadFile}>
              <IconButton component="span">
                <CloudUploadIcon style={{ color: "black" }} />
              </IconButton>
              <span>{filename}</span>
            </Paper>
          </label>
        </Grid>
      </Grid>
    );
  }

  fileUpload(file, name) {
    const { addFileName } = this.props;
    addFileName(file.name);
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const { dispatch } = this.props;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);

      if (name === "calibration") {
        const calibration = {
          ...fileUpload.CALIBRA_TEMPERATURA,
          ...fileUpload.CALIBRA_VIBRACAO,
          ...fileUpload.CALIBRA_FORCA,
          ...fileUpload.CALIBRA_VELOCIDADE,
          ...fileUpload.CALIBRA_COMANDO,
          ...fileUpload.CALIBRA_RELACOES
        };
        dispatch(initialize("calibration", calibration));
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { filename, classes, calibId } = this.props;
    const { allCalibration } = this.state;

    const calibStates = {
      allCalibration,
      calibId
    };

    return (
      <Grid alignItems="center" justify="center" container>
        {this.uploadField("calibration", filename)}
        <Grid
          container
          justify="center"
          item
          alignItems="center"
          xs={12}
          style={{ marginTop: "50px" }}
        >
          {selectCalibration(this.handleChange, calibStates, classes)}
          {defaultButton(this.handleUpDefault)}
        </Grid>
      </Grid>
    );
  }
}

CalibrationUpload.defaultProps = {
  filename: "",
  calibId: "",
  calibration: { values: {} }
};

CalibrationUpload.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  addFileName: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  filename: PropTypes.string,
  sendMessage: PropTypes.func.isRequired,
  changeCalib: PropTypes.func.isRequired,
  calibId: PropTypes.number,
  calibration: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  addFileName: value => dispatch(addFile(value)),
  sendMessage: payload => dispatch(messageSistem(payload)),
  changeCalib: payload => dispatch(changeCalibTest(payload))
});

const mapStateToProps = state => ({
  calibration: state.form.calibration,
  filename: state.fileReducer.filename,
  calibId: state.testReducer.calibId
});

const Upload = reduxForm({
  form: "calibration",
  destroyOnUnmount: false
})(CalibrationUpload);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Upload));
