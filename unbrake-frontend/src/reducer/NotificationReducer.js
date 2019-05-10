export default (state = {}, action) => {
  const { message, variante } = action;

  switch (action.type) {
    case "MESSAGE_USER":
      return { ...state, message, variante };
    default:
      return state;
  }
};
