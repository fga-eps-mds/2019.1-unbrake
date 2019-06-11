export default (state = {}, action) => {
  const { url } = action;

  switch (action.type) {
    case "REDIRECT_PAGE":
      return { ...state, url };
    default:
      return state;
  }
};
