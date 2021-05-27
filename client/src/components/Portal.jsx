import Map from "./Map.jsx";
import List from "./List.jsx";
import { Component } from "react";
import api from "../services/mapService";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Navigationbar from "./Navigationbar.jsx";
import SearchBar from "./SearchBar.jsx";
import React from "react";
import Devices from "./Devices.jsx";
import { Modal, Button, Form, Row, Col, Input, Alert, message } from "antd";
import UserService from "../services/user.service";
import "antd/dist/antd.css";

var today = new Date();
var curHr = today.getHours();

var passwordValidator = require("password-validator");
var schema = new passwordValidator();

schema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();

const ValidateMessege = (props) => {
  if (props.display) {
    return (
      <Alert
        className="mb-3"
        message="Password doesn't meet the required password policy."
        type="error"
      />
    );
  } else {
    return <p></p>;
  }
};

class Portal extends Component {
  constructor(props) {
    super(props);

    this.Map = React.createRef();
    this.devicesComponent = React.createRef();

    this.state = {
      apiResponse: [],
      data: [],
      mapView: "list",
      searchDevice: "",
      filterStatus: "None",
      filterCouncil: null,
      selectedLight: null,
      showChangePassModal: false,
      showAlert: false,
      councilList: null,
    };
  }

  callbackFunctionDeviceSelected = (selectedDevice) => {
    console.log(selectedDevice);
    this.setState({ selectedLight: selectedDevice });
    this.devicesComponent.current.assignSelectedDevice(selectedDevice);
  };

  //this is the API call from the server, to get streetlight data.
  componentDidMount() {
    const { user: currentUser } = this.props;

    const councils = [
      "KENSINGTON",
      "ASCOT VALE",
      "NORTH MELBOURNE",
      "FLEMINGTON",
    ];

    api.get("admin/portal").then((res) => {
      // // console.log(res.data.devices);
      this.setState({
        apiResponse: res.data.devices,
        data: res.data.devices,
        listViewData: res.data.devices,
        councilList: councils,
      });
    });

    if (currentUser !== null) {
      UserService.checkChangePassFlag(currentUser.email).then((response) => {
        this.setState({
          showChangePassModal: response.data,
        });
      });
    }
  }

  //NEWLY ADDED
  setView = (view) => {
    this.setState({
      mapView: view,
    });
  };

  setSearchDevice = (device) => {
    this.setState({
      searchDevice: device,
    });

    if (device) {
      this.state.data = this.state.data.filter(
        (deviceInner) =>
          String(deviceInner.UTIL_DEVICE_ID).indexOf(String(device)) >= 0 ||
          deviceInner.UTIL_DEVICE_ID === device
      );
    }

    // // console.log(`searching for: ${device}`);
    if (this.Map && this.Map.current) {
      this.Map.current.searchCenter(device);
    }
  };

  setCouncilFilter = (filter) => {
    var tempData = [];
    // console.log(filter);
    if (filter == "All") {
      tempData = this.state.apiResponse;
      // console.log(tempData);
      this.setState({
        filterCouncil: null,
        data: tempData,
        listViewData: tempData,
      });
    } else {
      this.setState({
        filterCouncil: filter,
      });
      tempData = this.state.apiResponse.filter(
        (device) => device.CITY == filter
      );
    }

    if (!(this.state.filterStatus == "None")) {
      if (
        this.state.filterStatus > 0 ||
        this.state.filterStatus == 0 ||
        this.state.filterStatus < 0
      ) {
        this.setState({
          data: tempData.filter(
            (device) => device.CURRENT_MAGNITUDE == this.state.filterStatus
          ),
        });
      } else {
        this.setState({
          data: tempData.filter(
            (device) => device.UIQ_DEVICE_STATE == this.state.filterStatus
          ),
        });
      }
    } else {
      this.setState({
        data: tempData,
      });
    }
  };

  setStatusFilter = (filter) => {
    var tempData = [];
    if (filter == "All") {
      tempData = this.state.apiResponse;
      // console.log(tempData);
      this.setState({
        filterStatus: "None",
        data: tempData,
      });
    } else {
      this.setState({
        filterStatus: filter,
      });
      if (filter > 0 || filter == 0 || filter < 0 || filter == null) {
        tempData = this.state.apiResponse.filter(
          (device) => device.CURRENT_MAGNITUDE == filter
        );
      } else {
        tempData = this.state.apiResponse.filter(
          (device) => device.UIQ_DEVICE_STATE == filter
        );
      }
    }

    if (this.state.filterCouncil) {
      this.setState({
        data: tempData.filter(
          (device) => device.CITY == this.state.filterCouncil
        ),
      });
    } else {
      this.setState({
        data: tempData,
      });
    }
  };

  // Sets new password for users with temporary password
  changePassword = (value) => {
    const { user: currentUser } = this.props;

    if (schema.validate(value.password)) {
      UserService.updatePassword(currentUser.email, value.password, false).then(
        (response) => {
          console.log(response);
          if (response.data === "Password updated") {
            message.success("Password updated successfully.");
            this.setState({
              showChangePassModal: false,
            });
          }
        }
      );
    } else {
      this.setState({
        showAlert: true,
      });
    }
  };

  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <Navigationbar />
        {/* <Devices device={this.state.apiResponse} /> */}
        {/* NEWLY ADDED */}
        <SearchBar
          className="search-bar-portal-area"
          view={this.setView}
          device={this.setSearchDevice}
          statusFilter={this.setStatusFilter}
          councilFilter={this.setCouncilFilter}
          councilList={this.state.councilList}
        />
        {this.state.mapView === "map" && (
          <Map
            ref={this.Map}
            data={this.state.data}
            searchDevice={this.state.searchDevice}
            portalDeviceSelectedCallback={this.callbackFunctionDeviceSelected}
          />
        )}
        {this.state.mapView === "list" && (
          <List view={this.setView} data={this.state.data} />
        )}

        <Devices ref={this.devicesComponent} device={this.state.apiResponse} />

        <Modal
          title="Set a new password"
          visible={this.state.showChangePassModal}
          maskClosable={false}
          closable={false}
          footer={[
            <Button
              form="changePass"
              key="submit"
              type="primary"
              htmlType="submit"
            >
              Change Password
            </Button>,
          ]}
          centered
        >
          <ValidateMessege display={this.state.showAlert} />
          <Form
            id="changePass"
            name="control-ref"
            preserve="false"
            layout="vertical"
            onFinish={this.changePassword.bind(this)}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <p style={{ fontWeight: "400" }}>
              Note: Your new password should have at least 8 characters
              including 1 uppercase, 1 digit and 1 symbol.
            </p>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Portal);
