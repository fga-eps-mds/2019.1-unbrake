import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import ConfigReducer from "./ConfigReducer";

const reducers = combineReducers({
  form: reduxFormReducer,
  configReducer: ConfigReducer
});

export default reducers;
