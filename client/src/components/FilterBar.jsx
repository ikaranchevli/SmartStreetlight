import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import SwitchedOn from "./images/switchedOn.svg";
import SwitchedOff from "./images/switchedOff.svg";
import Falty from "./images/faulty.svg";
import ToBeInstalled from "./images/tobeInstalled.svg";

class FilterBar extends Component {
  render() {
    return <div className="container device-summary mt-4"></div>;
  }
}

export default FilterBar;
