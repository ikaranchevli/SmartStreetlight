import { Redirect } from "react-router-dom";
import { history } from "../helpers/history";
import jwt from "jsonwebtoken";

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    const token = user.accessToken;
    const { exp } = jwt.decode(token);

    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("user");
      alert("Your token is expired. Please login again!");
      document.location.href = "/";
    } else {
      return { "x-access-token": user.accessToken };
    }
  } else {
    return <Redirect to="/login" />;
  }
}
