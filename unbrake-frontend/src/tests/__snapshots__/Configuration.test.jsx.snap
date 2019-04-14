import React from "react";
import Enzyme, { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import Configuration from "../components/Configuration";

Enzyme.configure({ adapter: new Adapter() });

describe("<Configuration />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<Configuration />);
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
