export const API_URL = process.env.REACT_APP_API_URL;
export const API_URL_GRAPHQL = process.env.REACT_APP_API_URL;
export const MQTT_HOST = "unbrake-hom.ml"; // process.env.REACT_APP_MQTT_HOST;
export const MQTT_PORT = process.env.REACT_APP_MQTT_PORT;
export const base10 = 10;

export const conversionFunction = (x, a, b) => {
  return parseFloat(a) * parseFloat(x) + parseFloat(b);
};

const validNumber = 0;

export const greaterThanZero = value =>
  value && parseInt(value, 10) <= validNumber
    ? "Deve ser maior que 0"
    : undefined;
