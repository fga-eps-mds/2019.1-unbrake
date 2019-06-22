import * as actions from "../../actions/RedirectActions";

describe("redirect page", () => {
  it("redirect to a specific page", () => {
    const url = "unbrake.ml/calibration";

    const expectedAction = {
      type: "REDIRECT_PAGE",
      url
    };
    expect(actions.redirect(url)).toEqual(expectedAction);
  });
});
