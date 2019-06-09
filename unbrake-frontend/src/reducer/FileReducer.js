export default (state = {}, action) => {
  switch (action.type) {
    case "ADD_FILE":
      return { filename: action.filename };

    default:
      return state;
  }
};
