import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Speed from "../../calibration/Speed";
import ComponentTest from "../ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Speed />", () => {
  const wrapper = shallow(<Speed />);
  ComponentTest(wrapper);
});
