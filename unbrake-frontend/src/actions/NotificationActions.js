import { MESSAGE_USER, TOGGLE_MESSAGE } from "./Types";

export const toggleMessage = payload => {
  return {
    type: TOGGLE_MESSAGE,
    payload
  };
};

export const messageSistem = payload => {
  return {
    type: MESSAGE_USER,
    payload
  };
};

export default messageSistem;
