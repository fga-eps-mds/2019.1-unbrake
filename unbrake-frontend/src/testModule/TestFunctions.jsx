import { validateFields, saveCalibration } from "../calibration/Calibration";
import { createCalibration } from "../calibration/CalibrationVariables";
import { saveConfiguration } from "../configuration/ConfigFunctions";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

const empty = 0;
const sizeMessageDefault = 14;

const configFields = [
  { front: "NOS", label: "Numero de Snubs" },
  { front: "USL", label: "Limite Superior (km/h)" },
  { front: "UWT", label: "Tempo de Espera (s)" },
  { front: "LSL", label: "Limite inferior (km/h)" },
  { front: "LWT", label: "Tempo de espera (s)" },
  { front: "TBS", label: "Tempo entre ciclos" },
  { front: "TAS", label: "Temperatura(˚C)(AUX1)" },
  { front: "TAT", label: "Tempo (s)(AUX1)" }
];

const validateConfig = (configuration, sendMessage) => {
  let createMessage = configFields.reduce((prevMessage, newField) => {
    if (
      configuration[newField.front] === undefined ||
      configuration[newField.front].length === empty
    ) {
      if (prevMessage.length === sizeMessageDefault)
        return `${prevMessage} "${newField.label}"`;
      return `${prevMessage}, "${newField.label}"`;
    }
    return prevMessage;
  }, "O(s) campo(s) ");

  if (createMessage.length > sizeMessageDefault) {
    createMessage += " está(ão) vazios";
    sendMessage({
      message: createMessage,
      variante: "error",
      condition: true
    });
    return false;
  }
  return true;
};

export const quitExperiment = (states, functions) => {
  const urlUser = `${API_URL_GRAPHQL}?query=query{currentUser{username}}`;
  Request(urlUser, "GET").then(username => {
    const { currentUser } = username.data;
    console.log(username, currentUser);
    const urlTesting = `${API_URL_GRAPHQL}?query=mutation{quitTesting(username:"${
      currentUser.username
    }",testingId:${
      states.testeId
    }, mqttHost:"unbrake.ml",mqttPort: 8000){response,error}}`;

    Request(urlTesting, "POST").then(response => {
      functions.handleChange(empty);
    });
  });
};

export const submit = (states, functions, dispatchs) => {
  const values = {
    calibration: states.calibration.values,
    name: "",
    createCalibration
  };

  if (states.calibId === "") {
    if (!validateFields(states.calibration.values, dispatchs.sendMessage))
      return;
    saveCalibration(values, dispatchs);
  }

  if (states.configId === "") {
    if (!validateConfig(states.configuration.values, dispatchs.sendMessage))
      return;
    saveConfiguration(states.configuration.values, "", dispatchs);
  }

  const urlUser = `${API_URL_GRAPHQL}?query=query{currentUser{username}}`;
  if (states.configId !== "" && states.calibId !== "") {
    Request(urlUser, "GET").then(username => {
      const { currentUser } = username.data;
      const urlTesting = `${API_URL_GRAPHQL}?query=mutation{createTesting(createBy:"${
        currentUser.username
      }",
          idCalibration:${states.calibId},idConfiguration:${
        states.configId
      }){testing{id},error}}`;

      Request(urlTesting, "POST").then(response => {
        const { createTesting } = response.data;
        const { id } = createTesting.testing;

        functions.handleChange(id);
        const urlSubmit = `${API_URL_GRAPHQL}?query=mutation{submitTesting(mqttHost:"unbrake.ml",mqttPort:8080,testingId:${id}){succes}}`;
        Request(urlSubmit, "POST").then(() => {
          //fazer trem aqui
        });
      });
    });
  }
};
