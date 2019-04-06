import { CHANGE_GRAPHIC_1, CHANGE_GRAPHIC_2 } from "./Types";

export const changeGraphic1 = value => {
  return {
    type: CHANGE_GRAPHIC_1,
    payload: value
  };
};
export const changeGraphic2 = value => {
  return {
    type: CHANGE_GRAPHIC_2,
    payload: value
  };
};
