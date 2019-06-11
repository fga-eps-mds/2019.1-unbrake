import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Relation from "../../calibration/Relation";
import ComponentTest from "../ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<Relation />", () => {
  const wrapper = shallow(<Relation />);
  ComponentTest(wrapper);
});
