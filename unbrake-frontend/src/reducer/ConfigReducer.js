import { CHANGE_GRAPHIC_1, CHANGE_GRAPHIC_2 } from "../actions/Types";

const INITIAL_STATE = {
  graphic1: false,
  graphic2: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_GRAPHIC_1:
      return { ...state, graphic1: action.payload };

    case CHANGE_GRAPHIC_2:
      return { ...state, graphic2: action.payload };

    default:
      return state;
  }
};
