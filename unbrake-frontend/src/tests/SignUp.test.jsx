import React from "react";
import Enzyme, { shallow } from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import fetch from "jest-fetch-mock";
import SignUp, {
  validate,
  submit,
  required,
  validateEmail
} from "../components/SignUp";
import { API_URL_GRAPHQL } from "../utils/Constants";
import reducers from "../reducer/index";

Enzyme.configure({ adapter: new Adapter() });

describe("<SignUp />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const context = React.createContext();
      const store = createStore(reducers);
      const wrapper = shallow(
        <Provider context={context} store={store}>
          <SignUp />
        </Provider>
      );
      const component = wrapper.dive();

      expect(toJson(component)).toMatchSnapshot();
    });
  });

  test("validate()", () => {
    const validate1 = {
      password: "password",
      confirmPassword: "apassword"
    };
    const validate2 = {
      password: "password",
      confirmPassword: "password"
    };
    const error1 = validate(validate1);
    const error2 = validate(validate2);

    expect(error1).toEqual({ confirmPassword: "As senhas não são iguais" });
    expect(error2).toEqual({});
  });

  test("required()", () => {
    const required1 = undefined;
    const required2 = "teste";

    const error1 = required(required1);
    const error2 = required(required2);
    expect(error1).toEqual("Obrigatório");
    expect(error2).toEqual();
  });

  test("validateEmail()", () => {
    const validateEmail1 = "teste";
    const validateEmail2 = "teste@teste.com";

    const error1 = validateEmail(validateEmail1);
    const error2 = validateEmail(validateEmail2);
    expect(error1).toEqual("Endereço de email inválido");
    expect(error2).toEqual();
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
        expect(fetch.mock.calls[0][0]).toEqual(API_URL_GRAPHQL);
      })
      .catch(() => {});
  });
});
