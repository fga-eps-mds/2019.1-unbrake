import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ComponentTest from "../ComponentTest";
import TestData from "../../testModule/TestData";

Enzyme.configure({ adapter: new Adapter() });

describe("<TestData />", () => {
  const wrapper = shallow(<TestData />);
  ComponentTest(wrapper);
});
