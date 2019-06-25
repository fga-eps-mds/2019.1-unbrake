import {
  CHANGE_CONFIG_TEST,
  CHANGE_CALIB_TEST,
  CHANGE_AVAILABLE_TEST,
  CHANGE_POWER_TEST
} from "./Types";

export const changeConfigTest = value => {
  return {
    type: CHANGE_CONFIG_TEST,
    payload: value
  };
};
export const changeCalibTest = value => {
  return {
    type: CHANGE_CALIB_TEST,
    payload: value
  };
};

export const changeAvailableTest = value => {
  return {
    type: CHANGE_AVAILABLE_TEST,
    payload: value
  };
};

export const changePowerTest = value => {
  return {
    type: CHANGE_POWER_TEST,
    payload: value
  };
};

export default { changeCalibTest, changeConfigTest };
