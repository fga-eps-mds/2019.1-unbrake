import React from "react";
import Enzyme, { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import Login from "../components/Login";

Enzyme.configure({ adapter: new Adapter() });

describe("<RealTimeChart />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<Login />);
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
