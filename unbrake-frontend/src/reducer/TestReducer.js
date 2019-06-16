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
      console.log("aaaa", {
        ...state,
        configId: action.payload.configId,
        configName: action.payload.configName
      });
      return {
        ...state,
        configId: action.payload.configId,
        configName: action.payload.configName
      };

    case CHANGE_CALIB_TEST:
      console.log(action.payload);
      return {
        ...state,
        calibId: action.payload.calibId,
        calibName: action.payload.calibName
      };
    default:
      return state;
  }
};
