export const notification = (message, level) => {
  return {
    type: "MESSAGE_USER",
    message,
    variante: level
  };
};

export const messageSistem = (message, level) => {
  return dispatch => {
    dispatch(notification(message, level));
    return notification;
  };
};

export default messageSistem;
