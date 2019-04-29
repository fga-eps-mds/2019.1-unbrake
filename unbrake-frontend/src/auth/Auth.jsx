import Cookies from "universal-cookie";

const cookies = new Cookies();

class Auth {
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

  static isAuthenticated() {
    return (
      cookies.get("token") !== "undefined" &&
      cookies.get("token") !== "null" &&
      cookies.get("token") !== undefined &&
      cookies.get("token") !== null
    );
  }

  static hasPermission(permission) {
    return (
      Auth.isAuthenticated() && cookies.get("token") && permission !== null
    );
  }

  static getAuth() {
    return cookies.get("token");
  }

  static deauthenticate() {
    return cookies.remove("token");
  }

  static isSuperuser(isSuperuser) {
    const currentuserIsSuperuser = cookies.get("is_superuser");
    if (isSuperuser) {
      return currentuserIsSuperuser === "true";
    }
    return false;
  }
}

export { Auth as default };
