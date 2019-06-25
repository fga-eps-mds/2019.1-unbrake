import {
  CHANGE_CONFIG_TEST,
  CHANGE_CALIB_TEST,
  CHANGE_AVAILABLE_TEST,
  CHANGE_POWER_TEST
} from "../actions/Types";

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
    case CHANGE_AVAILABLE_TEST:
      return {
        ...state,
        available: action.payload.available
      };
    case CHANGE_POWER_TEST:
      return {
        ...state,
        power: action.payload.power
      };
    default:
      return state;
  }
};
