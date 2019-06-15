import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Vibration from "../../calibration/Vibration";
import ComponentTest from "../ComponentTest";
import reducers from "../../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<Vibration />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Vibration />
    </Provider>
  );
  ComponentTest(wrapper);
});
