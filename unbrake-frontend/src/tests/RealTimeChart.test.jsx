// react-test-render

import React from "react";
import Enzyme from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { create } from "react-test-renderer";
import RealTimeChart from "../components/RealTimeChart";
import reducers from "../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<RealTimeChart />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const context = React.createContext();
      const store = createStore(reducers);
      const wrapper = create(
        <Provider context={context} store={store}>
          <RealTimeChart context={context} />
        </Provider>
        
      );
      

      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
