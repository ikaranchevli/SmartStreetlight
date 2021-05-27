import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Input,
  Form,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Tooltip,
  Popconfirm,
  message,
  Modal,
  Divider,
  Breadcrumb,
  Empty,
  Alert,
} from "antd";
import {
  SearchOutlined,
  EditFilled,
  DeleteFilled,
  QuestionCircleOutlined,
  RollbackOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";

import UserService from "../services/user.service";
import Navigationbar from "./Navigationbar.jsx";
import { addUser } from "../actions/auth";
import { clearMessage } from "../actions/message";

class UserTable extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      modifyUserModalVisible: false,
      addUserModalVisible: false,
      changePassModalVisible: false,
      selectedUser: {
        email: "",
        firstname: "",
        lastname: "",
      },
      filters: {
        email: "",
        userType: "all",
        userStatus: "all",
      },
      activeFilters: {
        searchIsActive: false,
        userTypeIsActive: false,
      },
    };
  }

  success = () => {
    message.config({
      duration: 100,
    });
    message.success("This is a success message");
  };

  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <>
          {role === "Technician" && (
            <Tag color="#108ee9" key={role}>
              <b>{role}</b>
            </Tag>
          )}
          {role === "Councilman" && (
            <Tag color="#50A3A4" key={role}>
              <b>{role}</b>
            </Tag>
          )}
          {role === "Administrator" && (
            <Tag color="#f50" key={role}>
              <b>{role}</b>
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => (
        <>
          {status === "Active" && (
            <Tooltip title="Active" placement="left">
              <Popconfirm
                title="Are you sure to Deactivate this User?"
                placement="bottom"
                okText="Deactivate"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.changeUserStatus(record.email)}
              >
                <Button
                  type="primary"
                  shape="circle"
                  style={{ background: "#2bae66ff", borderColor: "#0cab53" }}
                  icon={<CheckOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          )}
          {status === "Deactive" && (
            <Tooltip title="Deactive" placement="left">
              <Popconfirm
                title="Are you sure to Activate this User?"
                placement="bottom"
                okText="Activate"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => this.changeUserStatus(record.email)}
              >
                <Button
                  type="primary"
                  shape="circle"
                  danger
                  icon={<CloseOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 200,
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Modify">
            <Button
              shape="circle"
              style={{ verticalAlign: "0" }}
              icon={<EditFilled />}
              onClick={() => this.editUser(record.name, record.email)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this User?"
              placement="left"
              okText="Delete"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => this.handleDelete(record.email)}
            >
              <Button
                shape="circle"
                style={{ verticalAlign: "0" }}
                icon={<DeleteFilled />}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Change Password">
            <Button
              shape="circle"
              style={{ verticalAlign: "0" }}
              icon={<RollbackOutlined />}
              onClick={() => this.editPass(record.email)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    UserService.getAllUsers().then(
      (response) => {
        var allUsers = [];
        for (var i = 0; i < response.data.user.length; i++) {
          var userRole = "";
          var status = "";

          if (response.data.user[i].user_roles[0].roleId === 1) {
            userRole = "Technician";
          } else if (response.data.user[i].user_roles[0].roleId === 2) {
            userRole = "Councilman";
          } else {
            userRole = "Administrator";
          }

          if (response.data.user[i].active === true) {
            status = "Active";
          } else {
            status = "Deactive";
          }

          var newUser = {
            name:
              response.data.user[i].firstname +
              " " +
              response.data.user[i].lastname,
            email: response.data.user[i].email,
            role: userRole,
            status: status,
          };
          allUsers.push(newUser);
        }
        this.setState({
          users: allUsers,
          filteredUsers: allUsers,
        });
      },
      (error) => {
        console.log(error);
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

  handleDelete = (key) => {
    UserService.removeUser(key).then((response) => {
      if (response.data === "User Deleted") {
        this.fetchUsers();
        message.success("User successfully deleted.");
        this.forceUpdate();
      }
    });
  };

  toggleDeletePrompt(x) {
    this.setState({
      showDeleteToggle: !this.state.showDeleteToggle,
      selectedUser: x,
    });
  }

  filterUserType(value) {
    this.setState({
      filters: {
        userType: value,
        userStatus: "all",
      },
    });

    switch (value) {
      case "all":
        this.setState({
          filteredUsers: this.state.users,
        });
        return;

      default:
        var foundUsers = [];
        for (var i = 0; i < this.state.users.length; i++) {
          var role = this.state.users[i].role.toLowerCase();
          if (role.includes(value)) {
            foundUsers.push(this.state.users[i]);
          }
        }

        this.setState({
          filteredUsers: foundUsers,
        });

        return;
    }
  }

  filterUserStatus(value) {
    this.setState({
      filters: {
        userStatus: value,
        userType: "all",
      },
    });

    switch (value) {
      case "all":
        this.setState({
          filteredUsers: this.state.users,
        });
        return;

      default:
        var foundUsers = [];
        for (var i = 0; i < this.state.users.length; i++) {
          var status = this.state.users[i].status;
          if (status.includes(value)) {
            foundUsers.push(this.state.users[i]);
          }
        }

        this.setState({
          filteredUsers: foundUsers,
        });

        return;
    }
  }

  onSearch = (e) => {
    this.setState({
      filters: {
        email: e.target.value,
        userType: "all",
        userStatus: "all",
      },
    });

    var value = e.target.value.toLowerCase().replace(/\s/g, "");

    switch (value) {
      case "":
        this.setState({
          filteredUsers: this.state.users,
        });
        return;

      default:
        var foundUsers = [];
        for (var i = 0; i < this.state.users.length; i++) {
          if (
            this.state.users[i].name
              .toLowerCase()
              .replace(/\s/g, "")
              .includes(value) ||
            this.state.users[i].email.includes(value)
          ) {
            foundUsers.push(this.state.users[i]);
          }
        }

        this.setState({
          filteredUsers: foundUsers,
        });
        return;
    }
  };

  editUser(name, email) {
    var names = name.split(" ");

    this.setState(
      {
        selectedUser: {
          email: email,
          firstname: names[0],
          lastname: names[1],
        },
        modifyUserModalVisible: !this.state.modifyUserModalVisible,
      },
      () => this.populateModal(names[0], names[1])
    );
  }

  editPass(email) {
    this.setState(
      {
        selectedUser: {
          email: email,
        },
        changePassModalVisible: !this.state.setChangePassVisible,
      },
      () => this.populateChangePassModal(email)
    );
  }

  addUser = (values) => {
    const { dispatch } = this.props;

    dispatch(
      addUser(
        values.firstname,
        values.lastname,
        values.email,
        values.role,
        values.password
      )
    ).then(() => {
      this.setState({
        addUserModalVisible: false,
      });
      this.fetchUsers();
      this.forceUpdate();
      message.success("User successfully added.");
    });
  };

  setTempPassword = (values) => {
    UserService.updatePassword(values.email, values.password, true).then(
      (response) => {
        if (response.data === "Password updated") {
          this.setChangePassVisible(false);
          message.success("Temporary password updated successfully.");
          this.forceUpdate();
        }
      }
    );
  };

  setModifyUserVisible() {
    this.setState({
      modifyUserModalVisible: !this.state.modifyUserModalVisible,
      selectedUser: {},
    });
  }

  setChangePassVisible() {
    this.setState({
      changePassModalVisible: !this.state.changePassModalVisible,
    });
  }

  setAddUserVisible(visibility) {
    const { dispatch } = this.props;
    dispatch(clearMessage());
    this.setState(
      {
        addUserModalVisible: visibility,
      },
      () => this.populateAddUserModal()
    );
  }

  handleChange(e) {
    this.setState((prevState) => ({
      selectedUser: {
        ...prevState.selectedUser,
        [e.target.name]: e.target.value,
      },
    }));
  }

  populateModal = (fname, lname) => {
    this.formRef.current.setFieldsValue({
      firstnameItem: fname,
      lastnameItem: lname,
    });
  };

  populateAddUserModal = () => {
    this.formRef.current.setFieldsValue({
      firstname: "",
      lastname: "",
      email: "",
      role: null,
      password: "",
    });
  };

  populateChangePassModal = (email) => {
    this.formRef.current.setFieldsValue({
      email: email,
      password: "",
    });
  };

  saveUserToDB() {
    if (
      this.state.selectedUser.firstname !== "" &&
      this.state.selectedUser.lastname !== ""
    ) {
      UserService.editUser(this.state.selectedUser).then((response) => {
        if (response.data === "User updated") {
          this.setModifyUserVisible(false);
          this.fetchUsers();
          message.success("User details updated successfully.");
          this.forceUpdate();
        }
      });
    }
  }

  changeUserStatus(email) {
    UserService.updateUserStatus(email).then((response) => {
      if (response.data === "Status updated") {
        this.fetchUsers();
        message.success("Status updated successfully.");
        this.forceUpdate();
      }
    });
  }

  render() {
    const { user: currentUser } = this.props;
    const { message } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    return (
      <>
        <Navigationbar />
        {currentUser.roles[0] === "ROLE_ADMIN" && (
          <>
            <div className="container-fluid mt-3">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item>
                  <a href="/portal">Portal</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Manage Users</Breadcrumb.Item>
              </Breadcrumb>

              <Row gutter={16}>
                <Col span={6}>
                  <Input
                    placeholder="Search email or name"
                    prefix={<SearchOutlined />}
                    value={this.state.filters.email}
                    onChange={this.onSearch.bind(this)}
                  />
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Select
                      value={this.state.filters.userType}
                      onChange={this.filterUserType.bind(this)}
                    >
                      <Select.Option value="all">All Roles</Select.Option>
                      <Select.Option value="technician">
                        Technician
                      </Select.Option>
                      <Select.Option value="councilman">
                        Councilman
                      </Select.Option>
                      <Select.Option value="administrator">
                        Administrator
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Select
                      value="All Status"
                      value={this.state.filters.userStatus}
                      onChange={this.filterUserStatus.bind(this)}
                    >
                      <Select.Option value="all">All Status</Select.Option>
                      <Select.Option value="Active">Active</Select.Option>
                      <Select.Option value="Deactive">Deactive</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    style={{ float: "right" }}
                    onClick={() => this.setAddUserVisible(true)}
                  >
                    + New User
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="containe-fluid px-3">
              <Table
                columns={this.columns}
                dataSource={this.state.filteredUsers}
              />
              {/* +++++++++++++++ */}
              {/* Edit user Modal */}
              {/* +++++++++++++++ */}

              <Modal
                title="Edit User Details"
                centered
                visible={this.state.modifyUserModalVisible}
                onOk={() => this.setModifyUserVisible}
                onCancel={() => this.setModifyUserVisible(false)}
                footer={[
                  <Button
                    key="back"
                    onClick={() => this.setModifyUserVisible(false)}
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.saveUserToDB.bind(this)}
                  >
                    Save
                  </Button>,
                ]}
              >
                <Form
                  ref={this.formRef}
                  name="control-ref"
                  preserve="false"
                  layout="vertical"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Firstname"
                        name="firstnameItem"
                        rules={[
                          {
                            required: true,
                            message: "Firstname can't be empty!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Firstname"
                          name="firstname"
                          value={this.state.selectedUser.firstname}
                          onChange={this.handleChange.bind(this)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Lastname"
                        name="lastnameItem"
                        rules={[
                          {
                            required: true,
                            message: "Lastname can't be empty!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Lastname"
                          name="lastname"
                          value={this.state.selectedUser.lastname}
                          onChange={this.handleChange.bind(this)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider></Divider>
                  <Form.Item label="Reset Password" name="newPass">
                    <Input.Password placeholder="New Password" name="newPass" />
                  </Form.Item>
                </Form>
              </Modal>

              {/* +++++++++++++++ */}
              {/* Edit pass Modal */}
              {/* +++++++++++++++ */}

              <Modal
                title="Set temporary password"
                centered
                visible={this.state.changePassModalVisible}
                onOk={() => this.setModifyUserVisible}
                onCancel={() => this.setChangePassVisible(false)}
                footer={[
                  <Button
                    key="back"
                    onClick={() => this.setChangePassVisible(false)}
                  >
                    Cancel
                  </Button>,
                  <Button
                    form="changePassForm"
                    key="submit"
                    type="primary"
                    htmlType="submit"
                  >
                    Set Password
                  </Button>,
                ]}
              >
                <Form
                  ref={this.formRef}
                  id="changePassForm"
                  preserve="false"
                  layout="vertical"
                  onFinish={this.setTempPassword.bind(this)}
                >
                  <Form.Item label="Email" name="email">
                    <Input
                      placeholder="Selected User Email"
                      name="email"
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    label="Reset Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password can't be empty!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Temporary Password"
                      name="password"
                    />
                  </Form.Item>
                </Form>
              </Modal>

              {/* +++++++++++++++ */}
              {/* Add user Modal */}
              {/* +++++++++++++++ */}

              <Modal
                title="Add New User"
                centered
                visible={this.state.addUserModalVisible}
                onOk={() => this.setAddUserVisible}
                onCancel={() => this.setAddUserVisible(false)}
                footer={[
                  <Button
                    key="back"
                    onClick={() => this.setAddUserVisible(false)}
                  >
                    Cancel
                  </Button>,
                  <Button
                    form="addUserForm"
                    key="submit"
                    type="primary"
                    htmlType="submit"
                  >
                    Add User
                  </Button>,
                ]}
              >
                {message && (
                  <Alert className="mb-3" message={message} type="error" />
                )}

                <Form
                  ref={this.formRef}
                  id="addUserForm"
                  name="control-ref"
                  preserve="false"
                  layout="vertical"
                  onFinish={this.addUser.bind(this)}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Firstname"
                        name="firstname"
                        initialValue=""
                        rules={[
                          {
                            required: true,
                            message: "Firstname can't be empty!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Firstname"
                          name="firstname"
                          value={this.state.selectedUser.firstname}
                          onChange={this.handleChange.bind(this)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Lastname"
                        name="lastname"
                        rules={[
                          {
                            required: true,
                            message: "Lastname can't be empty!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Lastname"
                          name="lastname"
                          value={this.state.selectedUser.lastname}
                          onChange={this.handleChange.bind(this)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter valid Email Address!",
                      },
                    ]}
                  >
                    <Input placeholder="Email id" name="email" />
                  </Form.Item>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Please select a role!",
                      },
                    ]}
                  >
                    <Select placeholder="Select a role">
                      <Select.Option value="technician">
                        Technician
                      </Select.Option>
                      <Select.Option value="council">Councilman</Select.Option>
                      <Select.Option value="admin">Administrator</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password can't be empty!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Temporary password"
                      name="password"
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </>
        )}
        {currentUser.roles[0] !== "ROLE_ADMIN" && (
          <>
            <Empty
              className="mt-5 align-middle"
              image="https://cdn1.iconfinder.com/data/icons/security-and-protection-33/64/access-denied-security-login-block-512.png"
              imageStyle={{
                height: 120,
              }}
              description={
                <span style={{ marginTop: "10px" }}>
                  Sorry, you are not allowed to access this page!
                </span>
              }
            >
              <Button type="primary">
                <a href="/portal">Go to Portal</a>
              </Button>
            </Empty>
            ,
          </>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  const { message } = state.message;
  return {
    user,
    message,
  };
}

export default connect(mapStateToProps)(UserTable);
