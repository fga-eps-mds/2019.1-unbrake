export default (state = {}, action) => {
  switch (action.type) {
    case "ADD_FILE":
      console.log("olaaaaa", action);
      return { filename: action.filename };

    default:
      return state;
  }
};
