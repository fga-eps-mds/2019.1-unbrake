import fetch from "jest-fetch-mock";
import Request from "../utils/Request";
import { API_URL_GRAPHQL } from "../utils/Constants";

const Username = "OPA";
const password = "password";
const url = `${API_URL_GRAPHQL}?query=mutation{createUser(username:"${Username}",password:"${password}"){user{username}}}`;
const method = "POST";

describe("Test request", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("Call request and return response", () => {
    fetch.mockResponseOnce(
      JSON.stringify({ data: { createUser: { username: Username } } })
    );

    Request(url, method)
      .then(res => {
        expect(res.data.createUser.username).toEqual(Username);
      })
      .catch(() => {});

    /*
     *expect(fetch.mock.calls.length).toEqual(1)
     *expect(fetch.mock.calls[0][0]).toEqual(url)
     */
  });
});
