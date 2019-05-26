import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Login from "../components/Login";
import ComponentTest from "./ComponentTest";
import reducers from "../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<Login />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Login context={context} />
    </Provider>
  );

  ComponentTest(wrapper);
});
