import React from "react";
import Enzyme, { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import SignUp from "../components/SignUp";

Enzyme.configure({ adapter: new Adapter() });

describe("<SignUp />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<SignUp />);
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
