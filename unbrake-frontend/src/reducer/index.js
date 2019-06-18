import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import ConfigReducer from "./ConfigReducer";
import AuthReducer from "./AuthReducer";
import NotificationReducer from "./NotificationReducer";
import RedirectReducer from "./RedirectReducer";
import FileReducer from "./FileReducer";
import TestReducer from "./TestReducer";

const reducers = combineReducers({
  form: reduxFormReducer,
  configReducer: ConfigReducer,
  authReducer: AuthReducer,
  notificationReducer: NotificationReducer,
  redirect: RedirectReducer,
  fileReducer: FileReducer,
  testReducer: TestReducer
});

export default reducers;
