import { CHANGE_CONFIG_TEST, CHANGE_CALIB_TEST } from "./Types";

export const changeConfigTest = value => {
  return {
    type: CHANGE_CONFIG_TEST,
    payload: value
  };
};
export const changeCalibTest = value => {
  console.log(value);
  return {
    type: CHANGE_CALIB_TEST,
    payload: value
  };
};
export default { changeCalibTest, changeConfigTest };
