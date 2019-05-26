import { VERIFYING_AUTH } from "../actions/Types";

const INITIAL_STATE = {
  loadingVerifyingAuth: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VERIFYING_AUTH:
      return { loadingVerifyingAuth: action.payload };

    default:
      return state;
  }
};
