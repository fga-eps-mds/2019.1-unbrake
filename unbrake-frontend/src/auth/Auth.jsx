import Cookies from "universal-cookie";
import { API_URL_GRAPHQL } from "../utils/Constants";
import Request from "../utils/Request";

const cookies = new Cookies();

// class Auth {
/*
 *static authenticate(token) {
 * if (token.token !== undefined && token.token !== null) {
 * if (!Auth.isAuthenticated()) {
 * Auth.lastVerify = Date.now();
 * }
 * clearInterval(Auth.loginCheck);
 * clearTimeout(Auth.loginTimeout);
 * Auth.loginTimeout = setTimeout(Auth.refreshToken, 1000 * 60 * 4);
 * Auth.loginCheck = setInterval(Auth.checkAuth, 10000);
 * localStorage.setItem("token", token.token);
 * localStorage.setItem("username", token.username);
 * localStorage.setItem("userid", token.id);
 * localStorage.setItem("permissions", token.permissions);
 * }
 *}
 */

async function verifyToken() {
  const url = `${API_URL_GRAPHQL}?query=mutation{verifyToken(token: "${cookies.get(
    "token"
  )}"){payload}}`;
  const method = "POST";
  const response = await Request(url, method);
  return response;
}

export async function isAuthenticated() {
  const url = `${API_URL_GRAPHQL}?query=mutation{verifyToken(token: "${cookies.get(
    "token"
  )}"){payload}}`;
  const method = "POST";
  const response = await Request(url, method);

  return (
    cookies.get("token") !== "undefined" &&
    cookies.get("token") !== "null" &&
    cookies.get("token") !== undefined &&
    cookies.get("token") !== null &&
    response.data.verifyToken !== null
  );
}

export function hasPermission(permission) {
  /*
   * const response = await verifyToken();
   * const promise = Promise.resolve(response.data.verifyToken);
   */
  return cookies.get("token") && permission !== null;
}

async function getAuth() {
  return (await verifyToken()).data.verifyToken !== null;
}

const deauthenticate = () => {
  return cookies.remove("token");
};

export function isSuperuser(superuser) {
  const currentuserIsSuperuser = cookies.get("is_superuser");
  if (superuser) {
    return currentuserIsSuperuser === "true";
  }
  return false;
}
// }

export default {
  isAuthenticated,
  hasPermission,
  getAuth,
  deauthenticate,
  isSuperuser,
  verifyToken
};
