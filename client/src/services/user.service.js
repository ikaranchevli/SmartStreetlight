import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3001/api/test/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getTechnicianContent() {
    return axios.get(API_URL + "technician", { headers: authHeader() });
  }

  getCouncilContent() {
    return axios.get(API_URL + "council", { headers: authHeader() });
  }

  getAdminContent() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }

  getAllUsers() {
    return axios.get(API_URL + "users", { headers: authHeader() });
  }

  removeUser(email) {
    return axios.get(API_URL + "DeleteUser?email=" + email, {
      headers: authHeader(),
    });
  }

  searchUser(email) {
    if (email !== "") {
      return axios.get(API_URL + "FindUser?email=" + email, {
        headers: authHeader(),
      });
    } else {
      return axios.get(API_URL + "users", { headers: authHeader() });
    }
  }

  filterUserType(type) {
    return axios.get(API_URL + "FindUser?type=" + type, {
      headers: authHeader(),
    });
  }

  editUser(user) {
    return axios.get(
      API_URL +
        "EditUser?email=" +
        user.email +
        "&fname=" +
        user.firstname +
        "&lname=" +
        user.lastname,
      { headers: authHeader() }
    );
  }

  updatePassword(email, newpass) {
    return axios.get(
      API_URL + "SetPass?email=" + email + "&password=" + newpass,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new UserService();
