import React from "react";
import { Grid, Paper, IconButton } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";

export const query =
  "id, name, number, time, temperature, timeBetweenCycles, upperLimit, inferiorLimit, upperTime, inferiorTime, disableShutdown, enableOutput";

export async function submit(configuration, name, sendMessage) {
  if (name === "" || name === undefined) {
    sendMessage({
      message: "Favor inserir o nome da configuração",
      variante: "error",
      condition: true
    });
    return;
  }
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
  }){config{number, timeBetweenCycles,upperLimit,inferiorLimit}}}`;
  const method = "POST";
  Request(url, method).then(() => {
    sendMessage({
      message: "Arquivo cadastrado com sucesso",
      variante: "success",
      condition: true
    });
  });
  const waitTime = 3000;
  setTimeout(() => {
    window.location.reload();
  }, waitTime);
}

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

export default createConfig;
