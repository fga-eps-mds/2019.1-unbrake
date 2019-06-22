import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Speed from "../../calibration/Speed";
import ComponentTest from "../ComponentTest";
import reducers from "../../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<Speed />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Speed />
    </Provider>
  );
  ComponentTest(wrapper);
});
