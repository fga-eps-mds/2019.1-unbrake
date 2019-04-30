import React from "react";
import { Link } from "react-router-dom";

const NotAuthorizedRoute = () => (
  <div>
    <h1>401 - Recurso não autorizado</h1>
    <p>O recurso que você está entando buscar necessita de auteticação!</p>
    <br />
    <Link to="/login">Login page</Link>
  </div>
);

export default NotAuthorizedRoute;
