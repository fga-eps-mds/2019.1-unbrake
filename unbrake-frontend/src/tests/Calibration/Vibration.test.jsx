import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Vibration from "../../calibration/Vibration";
import ComponentTest from "../ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Vibration />", () => {
  const wrapper = shallow(<Vibration />);
  ComponentTest(wrapper);
});
