import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "../../reducer/index";
import Force from "../../calibration/Force";
import ComponentTest from "../ComponentTest";
import reducers from "../../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<Force />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Force context={context} />
    </Provider>
  );
  ComponentTest(wrapper);
});
