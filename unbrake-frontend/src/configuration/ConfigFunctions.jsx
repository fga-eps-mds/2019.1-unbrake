import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

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
  await Request(url, method);

  window.location.reload();
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

export default createConfig;
