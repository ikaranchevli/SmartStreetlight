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
import DeviceInfo from "./DeviceInfo";
import { helpers, DeviceStatus } from "../helpers/history.js";

var today = new Date();
var curHr = today.getHours();

class Portal extends Component {
  constructor(props) {
    super(props);

    this.Map = React.createRef();
    this.devicesComponent = React.createRef();

    this.state = {
      apiResponse: [],
      data: [],
      mapView: "map",
      searchDevice: "",
      filterStatus: "None",
      filterCouncil: null,
      selectedLight: null
    };
  }

  callbackFunctionDeviceSelected = (selectedDevice) => {
    console.log(selectedDevice);
    this.setState({ selectedLight: selectedDevice });
    this.devicesComponent.current.assignSelectedDevice(selectedDevice);
  }

  //this is the API call from the server, to get streetlight data.
  componentDidMount() {
    api.get("admin/portal").then((res) => {
      // // console.log(res.data.devices);
      this.setState({
        apiResponse: res.data.devices,
        data: res.data.devices,
        listViewData: res.data.devices,
      });
    });
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

    if(device){
      this.state.data = this.state.data.filter(
        deviceInner => ((String(deviceInner.UTIL_DEVICE_ID)).indexOf((String(device))) >=0 || deviceInner.UTIL_DEVICE_ID === device)
      );
    }
      
    // // console.log(`searching for: ${device}`);
    if(this.Map && this.Map.current){
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
        listViewData: tempData
      });
    } else {
      this.setState({
        filterCouncil: filter,
      });
      tempData = this.state.apiResponse.filter(
        (device) => device.AREA_CODE == filter
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
        listViewData: tempData
      });
    } else {
      this.setState({
        filterStatus: filter,
      });
      if (filter > 0 || filter == 0 || filter < 0) {
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
          (device) => device.AREA_CODE == this.state.filterCouncil
        ),
      });
    } else {
      this.setState({
        data: tempData,
        
        
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
        />
        {this.state.mapView === "map" && (
          <Map
            ref={this.Map}
            data={this.state.data}
            searchDevice={this.state.searchDevice}
            portalDeviceSelectedCallback = {this.callbackFunctionDeviceSelected}
          />
        )}
        {this.state.mapView === "list" && 
        <List
            view={this.setView}
            data={this.state.data} 
            />}

        <Devices 
              ref={this.devicesComponent}
              device={this.state.apiResponse} 
        />
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
