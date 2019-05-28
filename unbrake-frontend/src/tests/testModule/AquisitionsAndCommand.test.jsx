import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ComponentTest from "../ComponentTest";
import AquisitionsAndCommand from "../../testModule/AquisitionsAndCommand";

Enzyme.configure({ adapter: new Adapter() });

describe("<AquisitionsAndCommand />", () => {
  const wrapper = shallow(<AquisitionsAndCommand />);
  ComponentTest(wrapper);
});
