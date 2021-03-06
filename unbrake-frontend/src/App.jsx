import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import thunk from "redux-thunk";
import reducers from "./reducer/index";
import NotificationContainer from "./components/Notification";
import Routes from "./routes/Routes";

const theme = createMuiTheme({
  palette: {
    secondary: {
      // light: "#FFFFFF",
      main: "#59666D"
    }
  },
  typography: {
    text: {
      // Name of the rule
      color: "white" // Some CSS
    },
    useNextVariants: true
  }
});

const store = createStore(reducers, applyMiddleware(thunk));

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <Routes />
        <NotificationContainer />
      </React.Fragment>
    </MuiThemeProvider>
  </Provider>
);

export default App;
