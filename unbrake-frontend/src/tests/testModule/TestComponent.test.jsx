import React from "react";
import Enzyme, { shallow } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import { createStore } from "redux";
import ComponentTest from "../ComponentTest";
import Test from "../../testModule/TestComponent";
import reducers from "../../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<Test />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Test context={context} />
    </Provider>
  );
  ComponentTest(wrapper);
});
