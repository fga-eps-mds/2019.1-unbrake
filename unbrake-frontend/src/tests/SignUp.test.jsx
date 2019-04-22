import React from "react";
import Enzyme, { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import fetch from "jest-fetch-mock";
import SignUp, { validate, submit } from "../components/SignUp";

Enzyme.configure({ adapter: new Adapter() });

describe("<SignUp />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<SignUp />);
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });
  test("validate()", () => {
    const values1 = {
      username: "username",
      password: "password",
      confirmPassword: "apassword"
    };
    const values2 = { password: "password", confirmPassword: "password" };
    const values3 = { password: "password", confirmPassword: "apassword" };

    const error2 = validate(values1);
    const error3 = validate(values2);
    const error4 = validate(values3);

    expect(error2).toEqual({ confirmPassword: "Não confere" });
    expect(error3).toEqual({ username: "Obrigatório" });
    expect(error4).toEqual({
      username: "Obrigatório",
      confirmPassword: "Não confere"
    });
  });
});

describe("submit", () => {
  it("Call request and return response", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });
    const values = { username: "username", password: "password" };
    let response = "";
    fetch.mockResponseOnce(
      JSON.stringify({ data: { createUser: { username: values.username } } })
    );

    submit(values)
      .then(res => {
        response = res.data.createUser.username;
        expect(response).toBe(values.username);
        expect(fetch.mock.calls[0][0]).toEqual(
          "https://localhost:8000/graphql"
        );
      })
      .catch(() => {});
  });
});
