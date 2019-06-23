import * as actions from "../../actions/NotificationActions";
import * as types from "../../actions/Types";

describe("show a notification", () => {
  it("should create an action to send a message", () => {
    const payload = {
      message: "Inserir o valor correto, por favor",
      variante: "error",
      condition: true
    };

    const expectedAction = {
      type: types.MESSAGE_USER,
      payload
    };
    expect(actions.messageSistem(payload)).toEqual(expectedAction);
  });
});

describe("hide a notification", () => {
  it("should create an action to hide a notification", () => {
    const payload = {
      condition: true
    };

    const expectedAction = {
      type: types.TOGGLE_MESSAGE,
      payload
    };
    expect(actions.toggleMessage(payload)).toEqual(expectedAction);
  });
});
