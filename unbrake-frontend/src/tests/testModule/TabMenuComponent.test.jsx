import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ComponentTest from "../ComponentTest";
import TabMenuComponent from "../../testModule/TabMenuComponent";
import reducers from "../../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<TabMenuComponent />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <TabMenuComponent context={context} />
    </Provider>
  );
  ComponentTest(wrapper);
});
