import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ComponentTest from "../ComponentTest";
import TabMenuComponent from "../../testModule/TabMenuComponent";

Enzyme.configure({ adapter: new Adapter() });

describe("<TabMenuComponent />", () => {
  const wrapper = shallow(<TabMenuComponent />);
  ComponentTest(wrapper);
});
