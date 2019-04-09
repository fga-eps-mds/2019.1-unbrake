import React from "react";
import Enzyme, { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import { createStore } from "redux";
import RealTimeChart from "../components/RealTimeChart";
import reducers from "../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<RealTimeChart />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const store = createStore(reducers);
      const wrapper = shallow(
        <Provider store={store}>
          <RealTimeChart />
        </Provider>
      );
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
