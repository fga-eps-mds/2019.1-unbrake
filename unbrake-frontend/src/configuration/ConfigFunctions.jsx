import React from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Button,
  Dialog,
  Grid,
  Paper,
  IconButton,
  MenuItem
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";

export const query =
  "id, name, number, time, temperature, timeBetweenCycles, upperLimit, inferiorLimit, upperTime, inferiorTime, disableShutdown, enableOutput";

export async function saveConfiguration(configuration, name, dispatchs) {
  const { sendMessage, changeConfig } = dispatchs;

  const url = `${API_URL_GRAPHQL}?query=mutation{createConfig(name:"${name}",number:${
    configuration.NOS
  },timeBetweenCycles:${configuration.TBS},upperLimit:${
    configuration.USL
  },inferiorLimit:${configuration.LSL},upperTime:${
    configuration.UWT
  },inferiorTime:${configuration.LWT},disableShutdown:${
    configuration.TMO
  },enableOutput:${configuration.TAO},temperature:${configuration.TAS},time:${
    configuration.TAT
  }){config{id, number, timeBetweenCycles,upperLimit,inferiorLimit}}}`;
  const method = "POST";
  Request(url, method).then(response => {
    if (response.errors === undefined) {
      const { createConfig } = response.data;

      sendMessage({
        message: "Configuração cadastrado com sucesso",
        variante: "success",
        condition: true
      });

      changeConfig({ configId: createConfig.config.id });
      return true;
    }
    sendMessage({
      message: "Falha no cadastro do arquivo de calibração",
      variante: "error",
      condition: true
    });
    return false;
  });
}

export async function submitDefault(configuration, name, dispatchs) {
  const { sendMessage, changeConfig } = dispatchs;

  const url = `${API_URL_GRAPHQL}?query=mutation{createDefaultConfig(name:"${name}",number:${
    configuration.NOS
  },timeBetweenCycles:${configuration.TBS},upperLimit:${
    configuration.USL
  },inferiorLimit:${configuration.LSL},upperTime:${
    configuration.UWT
  },inferiorTime:${configuration.LWT},disableShutdown:${
    configuration.TMO
  },enableOutput:${configuration.TAO},temperature:${configuration.TAS},time:${
    configuration.TAT
  }){config{id, number, timeBetweenCycles,upperLimit,inferiorLimit}}}`;
  const method = "POST";
  Request(url, method).then(response => {
    if (response.errors === undefined) {
      const { createDefaultConfig } = response.data;

      sendMessage({
        message: "Configuração padrão cadastrado com sucesso",
        variante: "success",
        condition: true
      });

      changeConfig({ configId: createDefaultConfig.config.id });
      return true;
    }
    sendMessage({
      message: "Falha no cadastro do arquivo de calibração",
      variante: "error",
      condition: true
    });
    return false;
  });
}

export const dialogName = (functions, dialogStates) => {
  let isDisabled = true;
  if (localStorage.getItem("isSuperuser") === "true") isDisabled = false;
  return (
    <Dialog
      open={dialogStates.open}
      onClose={functions.handleClose}
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
          onChange={functions.handleChange}
          value={dialogStates.name}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              disabled={isDisabled}
              checked={dialogStates.isDefault}
              onChange={functions.handleIsDefault}
              value="isDefault"
              name="isDefault"
            />
          }
          label="Calibração padrão"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={functions.handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={functions.handleSubmit} color="primary">
          Cadastrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const createConfig = data => {
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
  return configurationDefault;
};

export const renderUploadField = (classes, fileUpload, names) => {
  return (
    <Grid container item xs={10} alignItems="center" justify="center">
      <Grid item xs={4} className={classes.title}>
        <h2>Upload arquivo de {names.archive}</h2>
      </Grid>

      <Grid item xs={4} className={classes.grid}>
        <label htmlFor="contained-button-file">
          <input
            id="contained-button-file"
            type="file"
            name={names.field}
            className={classes.input}
            onChange={e => fileUpload(e.target.files[0], names.field)}
          />
          <Paper className={classes.rootUploadFile}>
            <IconButton component="span">
              <CloudUploadIcon style={{ color: "black" }} />
            </IconButton>
            <span
              className={classes.input_file_name}
              placeholder="Upload do arquivo de configuração"
            >
              {names.fileName}
            </span>
          </Paper>
        </label>
      </Grid>
    </Grid>
  );
};

export const emptyConfig = {
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
  }
};

export const itensSelectionConfig = allConfiguration => {
  let allConfig = [{ id: 0, name: "" }];

  let notDefaultConfig;
  if (allConfiguration !== "")
    notDefaultConfig = allConfiguration.filter(configuration => {
      return configuration.name !== "";
    });

  if (allConfiguration !== "") allConfig = allConfig.concat(notDefaultConfig);
  const itens = allConfig.map(value => {
    return (
      <MenuItem key={value.name + value.id} value={value.id}>
        {value.name}
      </MenuItem>
    );
  });
  return itens;
};
export const selectConfiguration = (handleChange, configStates, classes) => {
  return (
    <Grid item xs={3} justify="center" container className={classes.title}>
      <TextField
        id="outlined-select-currency"
        select
        label="Configurações"
        value={configStates[0]}
        onChange={handleChange}
        name="configId"
        className={classes.formControl}
        margin="normal"
        variant="outlined"
      >
        {itensSelectionConfig(configStates[1])}
      </TextField>
    </Grid>
  );
};
export const defaultButton = handleUpDefault => {
  return (
    <Grid container justify="center" item alignItems="center" xs={3}>
      <Button onClick={handleUpDefault} color="secondary" variant="contained">
        Configuração Padrão
      </Button>
    </Grid>
  );
};
export default createConfig;
