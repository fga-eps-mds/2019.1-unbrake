import history from "../utils/history";

export const redirect = url => {
  return {
    type: "REDIRECT_PAGE",
    url
  };
};

export const redirectPage = payload => {
  return dispatch => {
    dispatch(redirect(payload.url));
    history.push(`${payload.url}`);
    return redirect;
  };
};

export default redirectPage;
