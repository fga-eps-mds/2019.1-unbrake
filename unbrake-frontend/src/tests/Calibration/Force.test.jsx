import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Force from "../../components/Calibration/Force";
import ComponentTest from "../ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Vibration />", () => {
  const wrapper = shallow(<Force />);
  ComponentTest(wrapper);
});
