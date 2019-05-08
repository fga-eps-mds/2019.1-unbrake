import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Configuration from "../components/Configuration";
import ComponentTest from "./ComponentTest.test";

Enzyme.configure({ adapter: new Adapter() });

describe("<Configuration />", () => {
  const wrapper = shallow(<Configuration />);
  ComponentTest(wrapper);
});
