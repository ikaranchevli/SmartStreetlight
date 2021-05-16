import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import UserService from "../services/user.service";
import Navigationbar from "./Navigationbar.jsx";

class UserTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      filteredUsers: [],
      showDeleteToggle: false,
      selectedUser: "",
      filters: {
        email: "",
        userType: "all",
      },
      activeFilters: {
        searchIsActive: false,
        userTypeIsActive: false,
      },
    };
  }

  componentDidMount() {
    UserService.getAllUsers().then(
      (response) => {
        var allUsers = [];
        for (var i = 0; i < response.data.user.length; i++) {
          allUsers.push(response.data.user[i]);
        }
        this.setState({
          users: allUsers,
          filteredUsers: allUsers,
        });
      },
      (error) => {
        this.setState({
          filteredUsers:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  toggleDeletePrompt(x) {
    this.setState({
      showDeleteToggle: !this.state.showDeleteToggle,
      selectedUser: x,
    });
  }

  deleteUser() {
    UserService.removeUser(this.state.selectedUser).then((response) => {
      if (response.data === "User Deleted") {
        this.setState({
          showDeleteToggle: !this.state.showDeleteToggle,
          selectedUser: "",
        });
        window.location.reload(false);
      }
    });
  }

  _handleKeyDown = (e) => {
    if (e.target.value === "") {
      this.setState({
        activeFilters: {
          searchIsActive: false,
        },
      });
    } else {
      this.setState({
        activeFilters: {
          searchIsActive: true,
          userTypeIsActive: false,
        },
      });
    }

    this.setState({
      filters: {
        email: e.target.value,
        userType: "all",
      },
    });
    this.searchUser(e.target.value);
    this.forceUpdate();
  };

  searchUser(x) {
    var value = x.toLowerCase().replace(/\s/g, "");
    var foundUsers = [];
    for (var i = 0; i < this.state.users.length; i++) {
      var name =
        this.state.users[i].firstname.toLowerCase() +
        this.state.users[i].lastname.toLowerCase();

      if (this.state.users[i].email.includes(value) || name.includes(value)) {
        foundUsers.push(this.state.users[i]);
      }
    }

    this.setState({
      filteredUsers: foundUsers,
    });

    this.forceUpdate();
  }

  filterUserType(e) {
    if (e.target.value === "all") {
      this.setState(
        {
          activeFilters: {
            userTypeIsActive: false,
            searchIsActive: false,
          },
          filters: {
            userType: "all",
            email: "",
          },
        },
        () => this.filterUsers()
      );
    } else {
      this.setState(
        {
          activeFilters: {
            userTypeIsActive: true,
            searchIsActive: false,
          },
          filters: {
            userType: e.target.value,
            email: "",
          },
        },
        () => this.filterUsers()
      );
    }
  }

  filterUsers() {
    if (this.state.activeFilters.userTypeIsActive) {
      const result = this.state.users.filter(
        (user) => user.user_roles[0].roleId == this.state.filters.userType
      );

      this.setState({
        filteredUsers: result,
      });
    } else {
      this.setState({
        filteredUsers: this.state.users,
      });
    }

    if (this.state.activeFilters.searchIsActive) {
      const emailFilter = this.state.filteredUsers.filter(
        (user) => user.email === this.state.filters.email
      );

      this.setState({
        filteredUsers: emailFilter,
      });
    }
  }

  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    if (currentUser.roles[0] === "ROLE_ADMIN") {
      return (
        <div>
          <Navigationbar />

          <div className="row align-items-center p-3 mt-2">
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                id="searchUser"
                placeholder="Search name or email"
                value={this.state.filters.email}
                onChange={this._handleKeyDown.bind(this)}
              />
            </div>
            <div className="col-3 border-right">
              <select
                className="form-control"
                id="userType"
                value={this.state.filters.userType}
                onChange={this.filterUserType.bind(this)}
              >
                <option value="all">All Roles</option>
                <option value="1">Technicians</option>
                <option value="2">Councilmans</option>
                <option value="3">Administrators</option>
              </select>
            </div>
            <div className="col-3">
              <select
                className="form-control"
                id="userStatus"
                onChange={this.filterUserStatus}
                disabled
              >
                <option value="all">All Status</option>
                <option value="active">Active Users</option>
                <option value="disabled">Disabled Users</option>
              </select>
            </div>
            <div className="col-2 d-grid gap-2 d-md-flex justify-content-md-end">
              <button className="btn btn-outline-primary" type="button">
                + New User
              </button>
            </div>
          </div>

          <div className="container-fluid">
            <table className="table table-striped">
              <thead>
                <tr className="table-light">
                  <th scope="col" style={{ width: "80px" }}></th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th
                    scope="col"
                    style={{ width: "100px" }}
                    className="text-center"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.filteredUsers.map((user, index) => (
                  <tr>
                    <th scope="row">{user.id}</th>
                    <td>
                      {user.firstname} {user.lastname}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.user_roles.map((user_roles, index) => {
                        if (user_roles.roleId === 1) {
                          return (
                            <span
                              class="badge text-light bg-primary px-2"
                              style={{ fontSize: "0.9rem" }}
                            >
                              Technician
                            </span>
                          );
                        } else if (user_roles.roleId === 2) {
                          return (
                            <span
                              class="badge text-light bg-secondary px-2"
                              style={{ fontSize: "0.9rem" }}
                            >
                              Councilman
                            </span>
                          );
                        } else if (user_roles.roleId === 3) {
                          return (
                            <span
                              class="badge text-light bg-success px-2"
                              style={{ fontSize: "0.9rem" }}
                            >
                              Administrator
                            </span>
                          );
                        }
                      })}
                    </td>
                    <td>
                      <div className="text-center">
                        <span>
                          <i className="far fa-edit action mr-2"></i>
                        </span>
                        <span>
                          <i className="fas fa-power-off action mr-2"></i>
                        </span>

                        <span
                          type="button"
                          onClick={() => this.toggleDeletePrompt(user.email)}
                        >
                          <i className="fas fa-trash action"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Modal
              className=".modal-dialog-centered"
              show={this.state.showDeleteToggle}
              centered
            >
              <Modal.Header
                closeButton
                onClick={() => this.toggleDeletePrompt("")}
              >
                <Modal.Title>Delete User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Delete user with email:{" "}
                <strong> {this.state.selectedUser} </strong>?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => this.toggleDeletePrompt("")}
                >
                  No
                </Button>
                <Button variant="primary" onClick={() => this.deleteUser()}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    } else {
      return <h1>Only Admins are allowed to see this page.</h1>;
    }
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(UserTable);
