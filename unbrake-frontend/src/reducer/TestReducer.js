import { CHANGE_CONFIG_TEST, CHANGE_CALIB_TEST } from "../actions/Types";

const INITIAL_STATE = {
  configId: "",
  calibId: "",
  configName: "",
  calibName: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_CONFIG_TEST:
      return {
        ...state,
        configId: action.payload.configId
      };

    case CHANGE_CALIB_TEST:
      return {
        ...state,
        calibId: action.payload.calibId
      };
    default:
      return state;
  }
};
