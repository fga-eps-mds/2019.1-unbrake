import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Configuration from "../Configuration/Configuration";
import ComponentTest from "./ComponentTest";
import reducers from "../reducer/index";

/*
 * import fetch from "jest-fetch-mock";
 * import { API_URL_GRAPHQL } from "../utils/Constants";
 */

Enzyme.configure({ adapter: new Adapter() });

describe("<Configuration />", () => {
  const context = React.createContext();
  const store = createStore(reducers);
  const wrapper = shallow(
    <Provider context={context} store={store}>
      <Configuration context={context} />
    </Provider>
  );

  ComponentTest(wrapper);

  /*
   * test("submit()", () => {
   *   const url
   */

  // })
});

/*
 * describe("submit", () => {
 *   it("Call request and return response", () => {
 *     beforeEach(() => {
 *       fetch.resetMocks();
 *     });
 *     const configuration = {
 *       LSL: 10,
 *       LWT: 10,
 *       NOS: 10,
 *       TAO: false,
 *       TAS: 10,
 *       TAT: 10,
 *       TBS: 10,
 *       TMO: false,
 *       USL: 10,
 *       UWT: 10
 *     };
 *     const name = "test";
 *     let response = "";
 *     fetch.mockResponseOnce(
 *       JSON.stringify({ data: { createConfig: { name } } })
 *     );
 */

/*
 *     submit(configuration, name)
 *       .then(res => {
 *         response = res.data.createConfig.name;
 *         expect(response).toBe(name);
 *         expect(fetch.mock.calls[0][0]).toEqual(API_URL_GRAPHQL);
 *       })
 *       .catch(() => {});
 *   });
 * });
 */
