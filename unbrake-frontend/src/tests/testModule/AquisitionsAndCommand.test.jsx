import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ComponentTest from "../ComponentTest";
import reducers from "../../reducer/index";
import AquisitionsAndCommand from "../../testModule/AquisitionsAndCommand";

Enzyme.configure({ adapter: new Adapter() });

describe("<AquisitionsAndCommand />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <AquisitionsAndCommand context={context} />
    </Provider>
  );
  ComponentTest(wrapper);
});
