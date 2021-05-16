import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import SwitchedOn from "./images/switchedOn.svg";
import SwitchedOff from "./images/switchedOff.svg";
import Falty from "./images/faulty.svg";
import ToBeInstalled from "./images/tobeInstalled.svg";

class DeviceSummary extends Component {
  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="container device-summary mt-4">
        <div className="row border border-1 rounded-top p-3">
          <div className="col-3">
            <img src={SwitchedOn} />
          </div>
          <div className="col-6 align-self-center">Switched On</div>
          <div className="col-3  text-center align-self-center">
            <div className="row">
              <div className="col" style={{ fontSize: "1.6rem" }}>
                <b>443</b>
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
          <div className="col-6 align-self-center">Switched Off</div>
          <div className="col-3 text-center align-self-center">
            <div className="row">
              <div className="col" style={{ fontSize: "1.6rem" }}>
                <b>12</b>
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
          <div className="col-6 align-self-center">Faulty</div>
          <div className="col-3 text-center align-self-center">
            <div className="row">
              <div className="col" style={{ fontSize: "1.6rem" }}>
                <b>22</b>
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
          <div className="col-6 align-self-center">To Be Installed</div>
          <div className="col-3 text-center align-self-center">
            <div className="row">
              <div className="col" style={{ fontSize: "1.6rem" }}>
                <b>45</b>
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
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(DeviceSummary);
