import { MESSAGE_USER, TOGGLE_MESSAGE } from "../actions/Types";

const INITIAL_STATE = {
  variante: "",
  message: "",
  condition: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MESSAGE_USER:
      return {
        ...state,
        variante: action.payload.variante,
        message: action.payload.message,
        condition: action.payload.condition
      };

    case TOGGLE_MESSAGE:
      return { ...state, condition: action.payload.condition };
    default:
      return state;
  }
};
