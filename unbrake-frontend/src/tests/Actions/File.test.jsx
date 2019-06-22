import * as actions from "../../actions/FileActions";

describe("add a file", () => {
  it("register the current filename", () => {
    const filename = "abobora.ini";

    const expectedAction = {
      type: "ADD_FILE",
      filename
    };
    expect(actions.addFile(filename)).toEqual(expectedAction);
  });
});
