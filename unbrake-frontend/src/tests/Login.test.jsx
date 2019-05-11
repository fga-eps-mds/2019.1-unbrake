import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Login from "../components/Login";
import ComponentTest from "./ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Login />", () => {
  const wrapper = shallow(<Login />);
  ComponentTest(wrapper);
});
