import axios from "axios";

const API_URL = "http://localhost:3001/api/auth/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "signin", { email, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(firstname, lastname, email, role, password) {
    return axios.post(API_URL + "createuser", {
      firstname,
      lastname,
      email,
      role,
      password,
    });
  }
}

export default new AuthService();
