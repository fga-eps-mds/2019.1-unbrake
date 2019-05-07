import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import ConfigReducer from "./ConfigReducer";
import AuthReducer from "./AuthReducer";

const reducers = combineReducers({
  form: reduxFormReducer,
  configReducer: ConfigReducer,
  authReducer: AuthReducer
});

export default reducers;
