import React from "react";
import Button from "@material-ui/core/Button";
import Cookies from "universal-cookie";
import history from "../utils/history";

const cookie = new Cookies();

const renderSignupUser = () => {
  if (localStorage.getItem("isSuperuser") === "true") {
    return (
      <Button
        style={{ textTransform: "none", marginRight: "20px" }}
        color="inherit"
        href="/signUp"
      >
        Cadastrar usuário
      </Button>
    );
  }
  return null;
};

const handleLogout = () => {
  cookie.remove("token");
  cookie.remove("csrftoken");
  localStorage.clear();
  history.push("/login");
};

const UserOptionsMenu = () => {
  return (
    <div>
      {renderSignupUser()}
      <Button
        style={{ textTransform: "none", marginRight: "20px" }}
        color="inherit"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default UserOptionsMenu;
