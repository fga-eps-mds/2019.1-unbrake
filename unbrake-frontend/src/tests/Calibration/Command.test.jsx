import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Command from "../../calibration/Command";
import ComponentTest from "../ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Vibration />", () => {
  const wrapper = shallow(<Command />);
  ComponentTest(wrapper);
});
