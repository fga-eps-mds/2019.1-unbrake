import Cookies from "universal-cookie";
import {
  isSuperuser,
  hasPermission,
  deauthenticate,
  isAuthenticated
} from "../auth/Auth";

const cookie = new Cookies();

describe("isAuthenticated function", () => {
  it("should return false", () => {
    const response = { data: { verifyToken: "username" } };
    const response1 = "anything";

    expect(isAuthenticated(response)).toBe(false);
    expect(isAuthenticated(response1)).toBe(false);

    cookie.set("token", "data", {
      path: "/"
    });

    expect(isAuthenticated(response)).toBe(true);
    expect(isAuthenticated(response1)).toBe(false);
  });
});

describe("hasPermission function", () => {
  it("should return true", () => {
    expect(hasPermission(true, true)).toBe(true);
  });
  it("should return false", () => {
    expect(hasPermission(true, false)).toBe(false);
    expect(hasPermission(null, false)).toBe(false);
    expect(hasPermission(null, true)).toBe(false);
  });
});

describe("isSuperuser function", () => {
  it("should return false", () => {
    /*
     * expect(isSuperuser(true, false)).toBe(false);
     * expect(isSuperuser(false, true)).toBe(false);
     */
    expect(isSuperuser(false, false)).toBe(false);
  });
  it("should return true", () => {
    expect(isSuperuser(true, true)).toBe(true);
  });
});

describe("deauthenticate function", () => {
  it("should return undefined", () => {
    cookie.set("token", "tokenValue", {
      path: "/"
    });
    expect(cookie.get("token")).not.toBe(undefined);
    expect(deauthenticate()).toBe(undefined);
    expect(cookie.get("token")).toBe(undefined);
  });
});
