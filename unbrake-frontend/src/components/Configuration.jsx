import React from "react";
import iniparser from "iniparser";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";
import ConfigurationForm from "./ConfigurationForm";

const styles = () => ({
  title: {
    padding: "5px"
  },
  grid: {
    padding: "5px"
  },
  formControl: {
    minWidth: 200
  }
});

const query =
  "id, name, number, time, temperature, timeBetweenCycles, upperLimit, inferiorLimit, upperTime, inferiorTime, disableShutdown, enableOutput";

async function submit(configuration, name) {
  const { TAS, TAT, TMO, TAO, UWT, NOS, LSL, USL, TBS, LWT } = configuration;

  const url = `${API_URL_GRAPHQL}?query=mutation{createConfig(name:"${name}",number:${NOS},timeBetweenCycles:${TBS},upperLimit:${USL},inferiorLimit:${LSL},upperTime:${UWT},inferiorTime:${LWT},disableShutdown:${TMO},enableOutput:${TAO},temperature:${TAS},time:${TAT}){config{number, timeBetweenCycles,upperLimit,inferiorLimit}}}`;
  const method = "POST";
  await Request(url, method);

  window.location.reload();
}

const itensSelection = allConfiguration => {
  let allConfig = [{ id: 0, name: "" }];
  allConfig = allConfig.concat(allConfiguration);

  const itens = allConfig.map(value => {
    return (
      <MenuItem key={value.name + value.id} value={value.id}>
        {value.name}
      </MenuItem>
    );
  });
  return itens;
};

const selectConfiguration = (handleChange, configStates, classes) => {
  return (
    <Grid item xs={4} className={classes.title}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-simple">Configurações</InputLabel>
        <Select
          value={configStates[0]}
          onChange={handleChange}
          input={
            <OutlinedInput
              labelWidth={configStates[0]}
              name="dataBaseConfiguration"
              id="outlined-age-simple"
            />
          }
        >
          {itensSelection(configStates[1])}
        </Select>
      </FormControl>
    </Grid>
  );
};

const dialogName = (handleChange, handleClose, dialogStates) => {
  return (
    <Dialog
      open={dialogStates.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Nome da Configuração</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Insira aqui o nome que você deseja dar para este arquivo de
          configuração
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          onChange={handleChange}
          value={dialogStates.name}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={() => submit(dialogStates.configuration, dialogStates.name)}
          color="primary"
        >
          Cadastrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configuration: {
        CONFIG_ENSAIO: {
          LSL: "",
          LWT: "",
          NOS: "",
          TAO: false,
          TAS: "",
          TAT: "",
          TBS: "",
          TMO: false,
          USL: "",
          UWT: ""
        },
        name: ""
      },
      dataBaseConfiguration: 0,
      allConfiguration: "",
      open: false
    };

    this.handleUpDefault = this.handleUpDefault.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }

  componentDidMount() {
    const url = `${API_URL_GRAPHQL}?query=query{configNotDefault{id, name}}`;
    const method = "GET";
    Request(url, method).then(json => {
      const data = json.data.configNotDefault;
      this.setState({ allConfiguration: data });
    });
  }

  handleClickSave(state) {
    const CONFIG_ENSAIO = state.configuration;
    const newConfig = { CONFIG_ENSAIO };
    this.setState({ configuration: newConfig });

    /*
     * if (newConfig.CONFIG_ENSAIO.TAO === false) {
     *   this.state.configuration.CONFIG_ENSAIO.TAO = false;
     * }
     * if (newConfig.CONFIG_ENSAIO.TMO === false) {
     *   this.state.configuration.CONFIG_ENSAIO.TMO = false;
     * }
     */

    this.handleClickOpen();
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleUpDefault() {
    const url = `${API_URL_GRAPHQL}?query=query{configDefault{${query}}}`;

    const method = "GET";

    const VAZIO = 0;

    Request(url, method).then(response => {
      if (response.data.configDefault.length === VAZIO) {
        return;
      }

      const data = response.data.configDefault[0];

      const configurationDefault = {
        CONFIG_ENSAIO: {
          LSL: data.inferiorLimit,
          LWT: data.inferiorTime,
          NOS: data.number,
          TAO: data.enableOutput,
          TAS: data.temperature,
          TAT: data.time,
          TBS: data.timeBetweenCycles,
          TMO: data.disableShutdown,
          USL: data.upperLimit,
          UWT: data.upperTime
        }
      };

      this.setState({ configuration: configurationDefault });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });

    if (event.target.name === "dataBaseConfiguration")
      this.handleSelectConfig(event.target.value);
  }

  handleSelectConfig(id) {
    const url = `${API_URL_GRAPHQL}?query=query{configAt(id:${id}){${query}}}`;

    const method = "GET";

    Request(url, method).then(response => {
      const data = response.data.configAt;

      const configurationDefault = {
        CONFIG_ENSAIO: {
          LSL: data.inferiorLimit,
          LWT: data.inferiorTime,
          NOS: data.number,
          TAO: data.enableOutput,
          TAS: data.temperature,
          TAT: data.time,
          TBS: data.timeBetweenCycles,
          TMO: data.disableShutdown,
          USL: data.upperLimit,
          UWT: data.upperTime
        }
      };

      this.setState({ configuration: configurationDefault });
    });
  }

  uploadField(field) {
    const { classes } = this.props;

    let archive;

    if (field === "calibration") archive = "Calibração";
    else archive = "Configuração";

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
      scope.setState({ configuration: fileUpload });
    };

    reader.readAsText(file, "UTF-8");
  }

  render() {
    const { classes } = this.props;
    const {
      configuration,
      dataBaseConfiguration,
      allConfiguration,
      open,
      name
    } = this.state;
    const configStates = [dataBaseConfiguration, allConfiguration];
    const dialogStates = {
      configuration: configuration.CONFIG_ENSAIO,
      open,
      name
    };

    return (
      <Grid
        alignItems="center"
        justify="center"
        style={{ minHeight: "5px" }}
        container
        spacing={40}
      >
        {this.uploadField("configuration")}

        {selectConfiguration(this.handleChange, configStates, classes)}
        <ConfigurationForm
          configuration={configuration}
          handleClickSave={this.handleClickSave}
        />
        <Button
          onClick={this.handleUpDefault}
          color="secondary"
          variant="contained"
        >
          Padrão
        </Button>
        {dialogName(this.handleChange, this.handleClose, dialogStates)}
      </Grid>
    );
  }
}

Configuration.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Configuration);
