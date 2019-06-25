import { validateFields, saveCalibration } from "../calibration/Calibration";
import { createCalibration } from "../calibration/CalibrationVariables";
import { saveConfiguration } from "../configuration/ConfigFunctions";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

const empty = 0;
const sizeMessageDefault = 14;

let url = "";

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

const successSubmit = dispatchs => {
  const { sendMessage } = dispatchs;
  const message = "Ensaio iniciado com sucesso";

  sendMessage({
    message,
    variante: "success",
    condition: true
  });
};

const errorSubmit = dispatchs => {
  const { sendMessage } = dispatchs;

  const message = "Falha ao iniciar o ensaio";
  sendMessage({
    message,
    variante: "error",
    condition: true
  });
};

const errorQuitTest = dispatchs => {
  const { sendMessage } = dispatchs;

  const message = "Falha ao calcelar o ensaio";
  sendMessage({
    message,
    variante: "error",
    condition: true
  });
};
export const quitExperiment = (states, functions, dispatchs) => {
  const urlUser = `${API_URL_GRAPHQL}?query=query{currentUser{username}}`;
  Request(urlUser, "GET").then(response => {
    const { data, errors } = response;

    if (errors !== undefined) {
      errorQuitTest(dispatchs);
      return;
    }

    const { username } = data.currentUser;
    const urlTesting = `${API_URL_GRAPHQL}?query=mutation{quitTesting(username:"${username}",testingId:${
      states.testeId
    }, mqttHost:"unbrake.ml",mqttPort: 8000){response,error}}`;

    Request(urlTesting, "POST").then(json => {
      const newData = json.data;
      const newErrors = json.errors;
      if (newErrors !== undefined) {
        errorQuitTest(dispatchs);
        return;
      }

      const { quitTesting } = newData;
      if (quitTesting.response === "Success") {
        functions.handleChange(empty);
        const message = "Ensaio cancelado com sucesso";
        dispatchs.sendMessage({
          message,
          variante: "success",
          condition: true
        });
      } else errorQuitTest(dispatchs);
    });
  });
};

const verifyErrorsSubmitTest = (newResponse, dispatchs) => {
  const { data, errors } = newResponse;

  if (errors !== undefined) {
    errorSubmit(dispatchs);
    return false;
  }

  const { error } = data.createTesting;

  if (error !== null) {
    errorSubmit(dispatchs);
    return false;
  }
  return true;
};

const requestTest = (states, functions, dispatchs) => {
  url = `${API_URL_GRAPHQL}?query=query{currentUser{username}}`;
  if (states.configId !== "" && states.calibId !== "") {
    Request(url, "GET").then(response => {
      const { data, errors } = response;

      if (errors !== undefined) {
        errorSubmit(dispatchs);
        return;
      }

      const { username } = data.currentUser;
      url = `${API_URL_GRAPHQL}?query=mutation{createTesting(createBy:"${username}",
          idCalibration:${states.calibId},idConfiguration:${
        states.configId
      }){testing{id},error}}`;

      Request(url, "POST").then(newResponse => {
        const dataTest = newResponse.data;

        if (!verifyErrorsSubmitTest(newResponse, dispatchs)){
          return;
        } 
        const { createTesting } = dataTest;

        const { testing } = createTesting;

        functions.handleChange(testing.id);
        url = `${API_URL_GRAPHQL}?query=mutation{submitTesting(mqttHost:"unbrake.ml",mqttPort:8080,testingId:${
          testing.id
        }){succes}}`;
        Request(url, "POST").then(json => {
          const dataLocal = json.data;
          const errosLocal = json.data;
          if (errosLocal !== undefined) {
            errorSubmit(dispatchs);
            return;
          }

          const { submitTesting } = dataLocal;

          const responseLocal = submitTesting.response;
          if (responseLocal !== null) {
            successSubmit(dispatchs);
          } else errorSubmit(dispatchs);
        });
      });
    });
  }
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

  requestTest(states, functions, dispatchs);
};
