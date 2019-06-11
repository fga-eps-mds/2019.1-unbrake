import React from "react";
import Cookies from "universal-cookie";

import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import history from "../utils/history";

const cookie = new Cookies();

const handleLogout = () => {
  cookie.remove("token");
  cookie.remove("csrftoken");
  localStorage.clear();
  history.push("/login");
};

const resetPasswordRedirect = () => {
  history.push("/reset-password");
};

const singUpRedirect = () => {
  history.push("/signup");
};

const itensMenu = () => {
  const objects = [
    { name: "Logout", function: handleLogout },
    { name: "Alterar Senha", function: resetPasswordRedirect },
    { name: "Cadastrar Usuário", function: singUpRedirect }
  ];
  const render = objects.map(value => {
    if (value.name === "Cadastrar Usuário") {
      if (localStorage.getItem("isSuperuser") === "true")
        return <MenuItem onClick={value.function}>{value.name}</MenuItem>;
      return "";
    }
    return <MenuItem onClick={value.function}>{value.name}</MenuItem>;
  });
  return render;
};

const UserOptionsMenu = () => {
  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      {auth && (
        <div>
          <IconButton
            style={{ textTransform: "none", marginRight: "20px" }}
            aria-label="Account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={open}
            onClose={handleClose}
          >
            {itensMenu()}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default UserOptionsMenu;
