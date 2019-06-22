import * as actions from "../../actions/AuthActions";
import * as types from "../../actions/Types";

describe("verify authentication", () => {
  it("should change the user auth status", () => {
    const value = true;

    const expectedAction = {
      type: types.VERIFYING_AUTH,
      payload: value
    };
    expect(actions.verifyingAuth(value)).toEqual(expectedAction);
  });
});
