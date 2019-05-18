import React from "react";
import iniparser from "iniparser";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MyForm from "./CalibrationTempForm";

const styles = () => ({
  title: {
    padding: "5px"
  },
  grid: {
    padding: "5px"
  }
});

class CalibrationUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = this.fileUpload.bind(this);
    this.state = {
      calibration: {
        CALIBRA_TEMPERATURA: {
          CHT1: "",
          FCT1: "",
          OFT1: "",
          CHT2: "",
          FCT2: "",
          OFT2: ""
        },

        CALIBRA_FORCA: {
          CHF1: "",
          FCF1: "",
          OFF1: "",
          CHF2: "",
          FCF2: "",
          OFF2: ""
        },

        CALIBRA_VELOCIDADE: {
          CHR1: "",
          RAP: ""
        },

        CALIBRA_COMANDO: {
          CHVC: "",
          CUVC: "",
          MAVC: "",
          CHPC: "",
          CUPC: "",
          MAPC: ""
        },

        CALIBRA_RELACOES: {
          LST: "",
          RAL: "",
          DIA: "",
          RSM: "",
          DPO: "",
          DPM: ""
        }
      }
    };
  }

  uploadField(field) {
    const { classes } = this.props;

    let archive;

    if (field === "calibration") archive = "Calibração";

    return (
      <Grid container item xs={10} alignItems="center" justify="center">
        <Grid item xs={4} className={classes.title}>
          <h2 justify="left">Upload arquivo de {archive}</h2>
        </Grid>
        <Grid item xs={4} className={classes.grid}>
          <Input
            type="file"
            name={field}
            onChange={e => this.fileUpload(e.target.files[0], field)}
          />
        </Grid>
      </Grid>
    );
  }

  fileUpload(file, name) {
    const formData = new FormData();
    formData.append("file", name);
    const reader = new FileReader();
    const scope = this;

    reader.onload = e => {
      const content = e.target.result;
      const fileUpload = iniparser.parseString(content);

      if (name === "calibration") {
        scope.setState({ calibration: fileUpload });
      }
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { calibration } = this.state;
    console.log("up", calibration);
    return (
      <Grid
        alignItems="center"
        justify="center"
        // style={{ minHeight: "100vh" }}
        container
        // spacing={40}
      >
        {this.uploadField("calibration")}
        <MyForm calibration={calibration} />
      </Grid>
    );
  }
}

CalibrationUpload.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(CalibrationUpload);
