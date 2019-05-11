import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import RealTimeChart from "../components/RealTimeChart";
import ComponentTest from "./ComponentTest";

Enzyme.configure({ adapter: new Adapter() });

describe("<RealTimeChart />", () => {
  const wrapper = shallow(<RealTimeChart />);
  ComponentTest(wrapper);
});
