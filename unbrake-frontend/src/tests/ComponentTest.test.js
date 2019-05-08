import Enzyme from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });
const componentTest = wrapper => {
  describe("render()", () => {
    test("renders the component", () => {
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
};
export default componentTest;
