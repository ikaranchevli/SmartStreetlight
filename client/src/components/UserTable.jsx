import React, { Component } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import UserService from "../services/user.service";
import Navigationbar from "./Navigationbar.jsx";

class UserTable extends Component {
  static selectedUser = [];

  constructor(props) {
    super(props);

    this.handeSaveUser = this.handeSaveUser.bind(this);

    this.state = {
      users: [],
      filteredUsers: [],
      showDeleteToggle: false,
      showModifyToggle: false,
      showAddUserToggle: false,
      selectedUser: {
        email: "",
        firstname: "",
        lastname: "",
        role: "",
        newPass: "",
        confirmPass: "",
      },
      newUser: {
        email: "",
        firstname: "",
        lastname: "",
        role: [],
        pass: "",
        confirmPass: "",
      },
      formError: [],
      allValOk: true,
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

  handleFormChange = (e) => {
    const { name, value } = e.target;

    this.setState((prevState) => ({
      selectedUser: {
        ...prevState.selectedUser,
        [name]: value,
      },
    }));
  };

  handleNewUserFormChange = (e) => {
    const { name, value } = e.target;

    this.setState(
      (prevState) => ({
        newUser: {
          ...prevState.newUser,
          [name]: value,
        },
      }),
      () => console.log(this.state.newUser)
    );
  };

  toggleDeletePrompt(x) {
    this.setState({
      showDeleteToggle: !this.state.showDeleteToggle,
      selectedUser: {
        email: x,
      },
    });
  }

  toggleModifyPrompt(x) {
    this.setState({
      showModifyToggle: !this.state.showModifyToggle,
    });

    for (var u of this.state.users) {
      if (u.email === x) {
        this.setState({
          selectedUser: {
            email: u.email,
            firstname: u.firstname,
            lastname: u.lastname,
            role: u.user_roles[0].roleId,
            newPass: "",
            confirmPass: "",
          },
          formError: "",
        });
      }
    }
  }

  toggleAddUserPrompt() {
    this.setState({
      showAddUserToggle: !this.state.showAddUserToggle,
    });
  }

  handeSaveUser() {
    var formErrors = [];

    if (
      this.state.selectedUser.firstname === "" ||
      this.state.selectedUser.lastname === ""
    ) {
      formErrors.push("Firstname & Lastname can't be empty.");
    }

    if (
      this.state.selectedUser.newPass !== this.state.selectedUser.confirmPass
    ) {
      formErrors.push("Confirm password should match the new password.");
    }

    this.setState(
      {
        formError: formErrors,
      },
      () => this.saveUserToDB(this.state.formError)
    );
  }

  saveUserToDB(errors) {
    if (errors.length === 0) {
      UserService.editUser(this.state.selectedUser).then((response) => {
        if (response.data === "User updated") {
          this.setState({
            showModifyToggle: !this.state.showModifyToggle,
          });
          window.location.reload(false);
        }
      });

      if (this.state.selectedUser.newPass !== "") {
        UserService.updatePassword(
          this.state.selectedUser.email,
          this.state.selectedUser.newPass
        ).then((response) => {
          console.log(response.data);
          if (response.data === "Password updated") {
            this.setState({
              showModifyToggle: !this.state.showModifyToggle,
            });
            window.location.reload(false);
          }
        });
      }
    }
  }

  validatePassword(pass, confirmPass) {
    if (pass === confirmPass) {
      console.log("same");
    } else {
      console.log("not same");
      return (
        <div className="alert alert-danger" role="alert">
          New Password and Confirm Password should be same.
        </div>
      );
    }
  }

  deleteUser() {
    UserService.removeUser(this.state.selectedUser.email).then((response) => {
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
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={this.toggleAddUserPrompt.bind(this)}
              >
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
                        <span
                          type="button"
                          onClick={() => this.toggleModifyPrompt(user.email)}
                        >
                          <i className="far fa-edit action mr-2"></i>
                        </span>
                        <span>
                          <i
                            className="fas fa-power-off action mr-2"
                            style={{ color: "lightgray" }}
                          ></i>
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

            {/* Delete User Modal */}
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
                <strong> {this.state.selectedUser.email} </strong>?
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

            {/* Edit User Modal */}
            <Modal
              className=".modal-dialog-centered"
              show={this.state.showModifyToggle}
              centered
            >
              <Modal.Header
                closeButton
                onClick={() => this.toggleModifyPrompt("")}
              >
                <Modal.Title>Edit User Details</Modal.Title>
              </Modal.Header>
              <Form
                onSubmit={this.saveUserDetailsDB}
                ref={(c) => {
                  this.form = c;
                }}
              >
                <Modal.Body>
                  {this.state.formError.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.formError}
                    </div>
                  )}
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstname">
                      <Form.Label>Firstname*</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstname"
                        placeholder="Firstname"
                        value={this.state.selectedUser.firstname}
                        onChange={this.handleFormChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastname">
                      <Form.Label>Lastname*</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastname"
                        placeholder="Lastname"
                        value={this.state.selectedUser.lastname}
                        onChange={this.handleFormChange}
                        required
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Label>Change Password</Form.Label>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Control
                        type="password"
                        name="newPass"
                        onChange={this.handleFormChange}
                        placeholder="New Password"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPasswordConfirm">
                      <Form.Control
                        type="password"
                        name="confirmPass"
                        onChange={this.handleFormChange}
                        placeholder="Confirm Password"
                      />
                    </Form.Group>
                  </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => this.toggleModifyPrompt("")}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    name="submit"
                    onClick={this.handeSaveUser}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            {/* Add User Modal */}
            <Modal
              className=".modal-dialog-centered"
              show={this.state.showAddUserToggle}
              centered
            >
              <Modal.Header
                closeButton
                onClick={this.toggleAddUserPrompt.bind(this)}
              >
                <Modal.Title>Add New User</Modal.Title>
              </Modal.Header>
              <Form>
                <Modal.Body>
                  {this.state.formError.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.formError}
                    </div>
                  )}
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstname">
                      <Form.Label>Firstname*</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstname"
                        placeholder="Firstname"
                        value={this.state.newUser.firstname}
                        onChange={this.handleNewUserFormChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastname">
                      <Form.Label>Lastname*</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastname"
                        placeholder="Lastname"
                        value={this.state.newUser.lastname}
                        onChange={this.handleNewUserFormChange}
                        required
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstname">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.newUser.email}
                        onChange={this.handleNewUserFormChange}
                        required
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Group controlId="formGridRole">
                    <Form.Label>Role*</Form.Label>
                    <Form.Control
                      as="select"
                      name="role"
                      onChange={this.handleNewUserFormChange}
                    >
                      <option vlaue="technician">Technician</option>
                      <option value="council">Councilman</option>
                      <option value="admin">Administrator</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Label>Password*</Form.Label>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Control
                        type="password"
                        name="pass"
                        onChange={this.handleNewUserFormChange}
                        placeholder="Password"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPasswordConfirm">
                      <Form.Control
                        type="password"
                        name="confirmPass"
                        onChange={this.handleNewUserFormChange}
                        placeholder="Confirm Password"
                      />
                    </Form.Group>
                  </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => this.toggleModifyPrompt("")}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    name="submit"
                    onClick={this.handeSaveUser}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
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
