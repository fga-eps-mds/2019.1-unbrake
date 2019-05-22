import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import ConfigReducer from "./ConfigReducer";
import AuthReducer from "./AuthReducer";
import NotificationReducer from "./NotificationReducer";

const reducers = combineReducers({
  form: reduxFormReducer,
  configReducer: ConfigReducer,
  authReducer: AuthReducer,
  notificationReducer: NotificationReducer
});

export default reducers;
