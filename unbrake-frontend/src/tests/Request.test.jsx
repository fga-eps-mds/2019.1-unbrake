import fetch from "jest-fetch-mock";
// import fetchMock from "fetch-mock";
import Request from "../utils/Request";

const Username = "ESA";
const password = "password";
const BaseUrl = "http://api:8000";
const url = `${BaseUrl}/graphql?query=mutation{createUser(username:"${Username}",password:"${password}"){user{username}}}`;
const method = "POST";

describe("asyncFetch", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("can fetch", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ data: { createUser: { user: { username: Username } } } })
    );

    const a = await Request(url, method);

    expect(a.data.createUser.user.username).toEqual(Username);
    // expect(fetch.mock.calls.length).toEqual(1)
  });
});
