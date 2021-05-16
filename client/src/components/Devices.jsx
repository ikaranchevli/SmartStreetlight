import React, { Component, Fragment } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import { helpers, DeviceStatus } from "../helpers/history";
import api from "../services/mapService";
import "./Devices/Devices.css";
import SwitchedOn from "./images/switchedOn.svg";
import SwitchedOff from "./images/switchedOff.svg";
import Falty from "./images/faulty.svg";
import ToBeInstalled from "./images/tobeInstalled.svg";
import Unreachable from "./images/unreachable.svg";

import streetLightsData from "./StreetLights.json";

class Devices extends Component {
  state = {
    devices: [],
    showHide: false,
    statedDevice: this.props.device,
    showHideDeviceStat: false,
  };

  componentDidMount() {
    var alldevices = [];
    api.get("admin/portal").then((res) => {
      // console.log(res.data.devices);
      this.setState({
        devices: res.data.devices,
      });
    });
    // for (var i = 0; i < streetLightsData.devices.length; i++) {
    //   console.log("reading::::" + streetLightsData.devices[i]);
    //   alldevices.push(streetLightsData.devices[i]);
    // }
    // this.setState({
    //   devices: alldevices,
    // });
  }

  handleModalShowHide(device) {
    console.log(device);
    this.setState({
      showHide: !this.state.showHide,
      statedDevice: device,
    });
  }

  handleDeviceStatModalShowHide() {
    this.setState({
      showHideDeviceStat: !this.state.showHideDeviceStat,
    });
  }

  handleModalHide() {
    this.setState({
      showHide: !this.state.showHide,
    });
  }

  handleDeviceStatModalHide() {
    this.setState({
      showHideDeviceStat: !this.state.showHideDeviceStat,
    });
  }

  handleChange(e) {
    let value = e.target.value;
    console.log(value);

    var alldevices = [];
    for (var i = 0; i < streetLightsData.devices.length; i++) {
      if (
        streetLightsData.devices[i].UTIL_DEVICE_ID.toString().includes(value)
      ) {
        console.log("FOUND::::" + streetLightsData.devices[i]);
        alldevices.push(streetLightsData.devices[i]);
      }
    }

    this.setState({
      devices: alldevices,
    });
  }

  handleCouncil(e) {
    let value = e.target.value;
    console.log(value);

    var alldevices = [];
    for (var i = 0; i < streetLightsData.devices.length; i++) {
      if (
        streetLightsData.devices[i].UTIL_PREMISE_ID.toString().includes(value)
      ) {
        console.log("FOUND::::" + streetLightsData.devices[i]);
        alldevices.push(streetLightsData.devices[i]);
      }
    }

    this.setState({
      devices: alldevices,
    });
  }

  handleStatus(e) {
    let value = e.target.value;
    console.log(value);

    var alldevices = [];
    for (var i = 0; i < streetLightsData.devices.length; i++) {
      if (
        this.findStatus(streetLightsData.devices[i]).toString().includes(value)
      ) {
        console.log("FOUND::::" + streetLightsData.devices[i]);
        alldevices.push(streetLightsData.devices[i]);
      }
    }

    this.setState({
      devices: alldevices,
    });
  }

  findStatus = (device) => {
    var today = new Date();
    var curHr = today.getHours();

    var status = helpers.getStatusOfDeviceNew(device);
    switch (status) {
      case DeviceStatus.ON:
        return "ON";
      case DeviceStatus.OFF:
        return "OFF";
      case DeviceStatus.FAULTY:
        return "FAULTY";
      case DeviceStatus.UNREACHABLE:
        return "UNREACHABLE";
      case DeviceStatus.NEW:
        return "TO BE INSTALLED";
      default:
        return "UNKNOWN";
    }
  };

  renderStatus = (device) => {
    //console.log(device);
    var status = helpers.getStatusOfDeviceNew(device);

    if (status === DeviceStatus.FAULTY) {
      return (
        <span className="bulbIcon FAULTY">
          <i className="fa fa-lightbulb-o"></i>
        </span>
      );
    } else if (status === DeviceStatus.ON) {
      return (
        <span className="bulbIcon ON">
          <i className="fa fa-lightbulb-o"></i>
        </span>
      );
    } else if (status === DeviceStatus.OFF) {
      return (
        <span className="bulbIcon OFF">
          <i className="fa fa-lightbulb-o"></i>
        </span>
      );
    } else if (status === DeviceStatus.UNREACHABLE) {
      return (
        <span className="bulbIcon UNREACHABLE">
          <i className="fa fa-lightbulb-o"></i>
        </span>
      );
    } else if (status === DeviceStatus.NEW) {
      return (
        <span className="bulbIcon TO_BE_INSTALLED">
          <i className="fa fa-lightbulb-o"></i>
        </span>
      );
    } else {
      return (
        <span className="bulbIcon UNKNOWN">
          <i className="fa fa-lightbulb-o"></i>
        </span>
      );
    }
  };

  calcOnStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      var status = helpers.getStatusOfDeviceNew(this.state.devices[i]);
      if (status === DeviceStatus.ON) {
        count = count + 1;
      }
    }

    return <span>{count}</span>;
  };

  calcOffStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      var status = helpers.getStatusOfDeviceNew(this.state.devices[i]);
      if (status === DeviceStatus.OFF) {
        count = count + 1;
      }
    }

    return <span>{count}</span>;
  };

  calcFaultyStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      var status = helpers.getStatusOfDeviceNew(this.state.devices[i]);
      if (status === DeviceStatus.FAULTY) {
        count = count + 1;
      } 
    }
    return <span>{count}</span>;
  };

  calcUnreachableStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      if (this.state.devices[i].UIQ_DEVICE_STATE === "Unreachable") {
        count = count + 1;
      }
    }
    return <span>{count}</span>;
  };

  calcNewStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      var status = helpers.getStatusOfDeviceNew(this.state.devices[i]);
      if (status === DeviceStatus.NEW) {
        count = count + 1;
      }
    }

    return <span>{count}</span>;
  };

  calcUnknownStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      var status = helpers.getStatusOfDeviceNew(this.state.devices[i]);
      if (status === DeviceStatus.UNKNOWN) {
        count = count + 1;
      }
    }
    return <span>{count}</span>;
  };

  calcFaultyUnknownStatusSummary = () => {
    var count = 0;
    for (var i = 0; i < this.state.devices.length; i++) {
      var status = helpers.getStatusOfDeviceNew(this.state.devices[i]);
      if (status === DeviceStatus.FAULTY) {
        count = count + 1;
      } 
      if (status === DeviceStatus.UNKNOWN) {
        count = count + 1;
      }
    }
    return <span>{count}</span>;
  };

  render() {
    if (this.state.devices.length > 0) {
      var items = this.state.devices.map((device) => (
        <div className="row bulbItem">
          <div className="col-2">{this.renderStatus.call(this, device)}</div>
          <div className="col-8">
            <div className="bulbIdName">{device.UTIL_DEVICE_ID}</div>
            <span className="bulbAddress">{device.ADDRESS1}</span>
          </div>
          <div
            className="col-2 bulbButton"
            onClick={() => this.handleModalShowHide(device)}
          >
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </div>
        </div>
      ));
    } else {
      var items = <h3>No Devices</h3>;
    }

    return (
      <Fragment>
        <div className="infoTab">
          <div className="infoTab-header text-center align-middle">
              <span className="bulbIcon ON mt-10" style={{ backgroundColor: "#fff", color: "#000" }}>
                <i className="fa fa-lightbulb"></i>
              </span>
              Device Summary
          </div>


            <div className="container device-summary">
                <div className="row border border-1 rounded-top p-3">
                  <div className="col-3">
                    <img src={SwitchedOn} />
                  </div>
                  <div className="col-6 align-self-center infoTab-row-text">Switched On</div>
                  <div className="col-3  text-center align-self-center">
                    <div className="row">
                      <div className="col" style={{ fontSize: "1.6rem" }}>
                        <b>{this.calcOnStatusSummary.call(this)}</b>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col"
                        style={{ fontSize: "0.8rem", color: "gray" }}
                      >
                        Devices
                  </div>
                    </div>
                  </div>
                </div>
              <div className="row border border-1 border-top-0 p-3">
                <div className="col-3">
                  <img src={SwitchedOff} />
                </div>
                <div className="col-6 align-self-center infoTab-row-text">Switched Off</div>
                <div className="col-3 text-center align-self-center">
                  <div className="row">
                    <div className="col" style={{ fontSize: "1.6rem" }}>
                      <b>{this.calcOffStatusSummary.call(this)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col"
                      style={{ fontSize: "0.8rem", color: "gray" }}
                    >
                      Devices
              </div>
                  </div>
                </div>
              </div>
              <div className="row border border-1 border-top-0 p-3">
                <div className="col-3">
                  <img src={Falty} />
                </div>
                <div className="col-6 align-self-center infoTab-row-text">Faulty</div>
                <div className="col-3 text-center align-self-center">
                  <div className="row">
                    <div className="col" style={{ fontSize: "1.6rem" }}>
                      <b>{this.calcFaultyUnknownStatusSummary.call(this)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col"
                      style={{ fontSize: "0.8rem", color: "gray" }}
                    >
                      Devices
              </div>
                  </div>
                </div>
              </div>
              
              <div className="row border border-1 border-top-0 rounded-bottom p-3">
                <div className="col-3">
                  <img src={ToBeInstalled} />
                </div>
                <div className="col-6 align-self-center infoTab-row-text">To Be Installed</div>
                <div className="col-3 text-center align-self-center">
                  <div className="row">
                    <div className="col" style={{ fontSize: "1.6rem" }}>
                      <b>{this.calcNewStatusSummary.call(this)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col"
                      style={{ fontSize: "0.8rem", color: "gray" }}
                    >
                      Devices
                </div>
                  </div>
                </div>
              </div>

              <div className="row border border-1 border-top-0 rounded-bottom p-3">
                <div className="col-3">
                  <img src={Unreachable} />
                </div>
                <div className="col-6 align-self-center infoTab-row-text">Unreachable</div>
                <div className="col-3 text-center align-self-center">
                  <div className="row">
                    <div className="col" style={{ fontSize: "1.6rem" }}>
                      <b>{this.calcUnreachableStatusSummary.call(this)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col"
                      style={{ fontSize: "0.8rem", color: "gray" }}
                    >
                      Devices
                </div>
                  </div>
                </div>
              </div>

            </div>
          
        </div>
        <Modal centered show={this.state.showHide}>
          <Modal.Header closeButton onClick={() => this.handleModalHide()}>
            <Modal.Title>Device Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <p>
                <strong>Device ID : </strong>{" "}
                <span> {this.state.statedDevice.UTIL_DEVICE_ID} </span>
              </p>
              <p>
                <strong>Mac Address : </strong>
                <span> {this.state.statedDevice.NIC_MAC_ID} </span>
              </p>
              <p>
                <strong>Device State : </strong>
                <span> {this.state.statedDevice.UIQ_DEVICE_STATE} </span>
              </p>
              <p>
                <strong>IP Address : </strong>
                <span> {this.state.statedDevice.IP_ADDRESS} </span>
              </p>
              <p>
                <strong>Latitude : </strong>
                <span> {this.state.statedDevice.LATITUDE_DEG} </span>
              </p>
              <p>
                <strong>Longitude : </strong>
                <span>{this.state.statedDevice.LONGITUDE_DEG}</span>
              </p>
              <p>
                <strong>Insert TS : </strong>
                <span>{this.state.statedDevice.INSERT_TS}</span>
              </p>
              <p>
                <strong>Premise ID : </strong>
                <span> {this.state.statedDevice.PREMISE_ID} </span>
              </p>
              <p>
                <strong>Address : </strong>
                <span>{this.state.statedDevice.ADDRESS1}</span>
              </p>
              <p>
                <strong>Instant Voltage : </strong>
                <span>{this.state.statedDevice.INSTANT_VOLTAGE}</span>
              </p>
              <p>
                <strong>Energy Delicvered : </strong>
                <span>{this.state.statedDevice.ENERGY_DELIVERED}</span>
              </p>
              <p>
                <strong>Current Magnitude : </strong>
                <span>{this.state.statedDevice.CURRENT_MAGNITUDE}</span>
              </p>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalHide()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal centered show={this.state.showHideDeviceStat}>
          <Modal.Header
            closeButton
            onClick={() => this.handleDeviceStatModalHide()}
          >
            <Modal.Title>Device Statistics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>STATUS</th>
                  <th>DEVICE COUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="bulbIcon ON">
                      <i className="fa fa-lightbulb-o"></i>
                    </span>
                  </td>
                  <td>SWITCHED ON</td>
                  <td>{this.calcOnStatusSummary.call(this)}</td>
                </tr>
                <tr>
                  <td>
                    <span className="bulbIcon OFF">
                      <i className="fa fa-lightbulb-o"></i>
                    </span>
                  </td>
                  <td>SWITCHED OFF</td>
                  <td>{this.calcOffStatusSummary.call(this)}</td>
                </tr>
                <tr>
                  <td>
                    <span className="bulbIcon FAULTY">
                      <i className="fa fa-lightbulb-o"></i>
                    </span>
                  </td>
                  <td>FAULTY</td>
                  <td>{this.calcFaultyStatusSummary.call(this)}</td>
                </tr>
                <tr>
                  <td>
                    <span className="bulbIcon UNREACHABLE">
                      <i className="fa fa-lightbulb-o"></i>
                    </span>
                  </td>
                  <td>UNREACHABLE</td>
                  <td>{this.calcUnreachableStatusSummary.call(this)}</td>
                </tr>
                <tr>
                  <td>
                    <span className="bulbIcon TO_BE_INSTALLED">
                      <i className="fa fa-lightbulb-o"></i>
                    </span>
                  </td>
                  <td>TO BE INSTALLED</td>
                  <td>{this.calcNewStatusSummary.call(this)}</td>
                </tr>
                <tr>
                  <td>
                    <span className="bulbIcon UNKNOWN">
                      <i className="fa fa-lightbulb-o"></i>
                    </span>
                  </td>
                  <td>UNKNOWN</td>
                  <td>{this.calcUnknownStatusSummary.call(this)}</td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.handleDeviceStatModalHide()}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default Devices;
