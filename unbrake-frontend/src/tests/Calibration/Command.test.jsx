import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import reducers from "../../reducer/index";
import Command from "../../calibration/Command";
import ComponentTest from "../ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Command />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Command context={context} />
    </Provider>
  );
  ComponentTest(wrapper);
});
