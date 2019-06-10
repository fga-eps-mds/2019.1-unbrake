import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import ConfigReducer from "./ConfigReducer";
import AuthReducer from "./AuthReducer";
import NotificationReducer from "./NotificationReducer";
import RedirectReducer from "./RedirectReducer";
import FileReducer from "./FileReducer";

const reducers = combineReducers({
  form: reduxFormReducer,
  configReducer: ConfigReducer,
  authReducer: AuthReducer,
  notificationReducer: NotificationReducer,
  redirect: RedirectReducer
  fileReducer: FileReducer
});

export default reducers;
