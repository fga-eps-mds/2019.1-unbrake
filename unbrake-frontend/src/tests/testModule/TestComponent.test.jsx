import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ComponentTest from "../ComponentTest";
import Test from "../../testModule/TestComponent";

Enzyme.configure({ adapter: new Adapter() });

describe("<Test />", () => {
  const wrapper = shallow(<Test />);
  ComponentTest(wrapper);
});
