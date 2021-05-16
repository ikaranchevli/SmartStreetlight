import GoogleMapReact from "google-map-react";
import React from "react";
import { Component, Fragment } from "react";
import "./Map/Map.css";
import shouldPureComponentUpdate from "react-pure-render";
import currentLocationMarker from "./images/currentLocation.svg";

import Devices from "./Devices";
import MapDeviceInfo from "./MapDeviceInfo";
import { FaLocationArrow } from "react-icons/fa";

var today = new Date();
var curHr = today.getHours();

function statusChecker(light) {
  if (light.CURRENT_MAGNITUDE > 0 && curHr < 18) {
    return "faultMarker";
  } else if (light.CURRENT_MAGNITUDE === 0 && curHr >= 18) {
    return "#faultMarker";
  } else if (light.CURRENT_MAGNITUDE > 0 && curHr >= 18) {
    return "#onMarker";
  } else if (light.CURRENT_MAGNITUDE === 0 && curHr < 18) {
    return "offMarker";
  } else if (light.UIQ_DEVICE_STATE === "Unreachable") {
    return "unreMarker";
  } else if (light.UIQ_DEVICE_STATE === "New") {
    return "tobeinsMarker";
  } else {
    return "unknownMarker";
  }
}

class GoogleMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: { lat: -37.8189572, lng: 144.9551552 },
      mapZoom: 17,
      selectedLight: null,
      cursorStyle: null,
      markerStyle: null,
      gpsStatus: false,
      defaultGps: null,
      markerOpacity: 1,
    };
  }

  sendSelectedDevice = (selectedLight) => {
    this.props.portalDeviceSelectedCallback(selectedLight);
  }


  lightColor(light) {
    if (light.CURRENT_MAGNITUDE > 0) {
      return "#2ecc71";
    } else if (light.CURRENT_MAGNITUDE === 0) {
      return "#ffa500";
    } else if (
      light.CURRENT_MAGNITUDE == null &&
      light.UIQ_DEVICE_STATE == null
    ) {
      return "#E74C3C";
    } else if (light.UIQ_DEVICE_STATE === "Unreachable") {
      return "#808080";
    } else if (light.UIQ_DEVICE_STATE === "New") {
      return "#2c2cd1";
    } else {
      return "#f0e68c";
    }
  }

  searchCenter(searchDevice) {
    console.log(`Reached here ${searchDevice}`);
    this.props.data.map((device) => {
      if (device.UTIL_DEVICE_ID == searchDevice) {
        this.setState({
          currentLocation: {
            lat: device.LATITUDE_DEG,
            lng: device.LONGITUDE_DEG,
          },
          selectedLight: device,
          markerOpacity: 0.5,
        });
      }
    });
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    // console.log(this.state);
    const apiIsLoaded = (map, maps) => {
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          const pos = { lat, lng };
          this.setState({
            currentLocation: pos,
            gpsStatus: true,
            defaultGps: pos,
          });
        }
      );
    };
    return (
      <div className="map">
        <GoogleMapReact
          className="map-main"
          bootstrapURLKeys={{
            key: "AIzaSyBDAErpm84gP9AfWWahAL04bghYw_W__5s",
            libraries: ["places"],
          }}
          defaultCenter={{ lat: -37.8189572, lng: 144.9551552 }}
          defaultZoom={this.state.mapZoom}
          center={this.state.currentLocation}
          options={{
            styles: require("./mapStyle.json"),
            draggableCursor: "default",
            disableDoubleClickZoom: "true",
            fullscreenControl: false,
          }}
          onDrag={() => {
            this.setState({
              currentLocation: null,
            });
          }}
          onClick={() => {
            this.setState({
              selectedLight: null,
              markerOpacity: 1,
            });
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
        >
          {this.props.data.map((lights) => (
            <div
              key={lights.UTIL_DEVICE_ID}
              lat={lights.LATITUDE_DEG}
              lng={lights.LONGITUDE_DEG}
              onClick={() => {
                this.setState({
                  currentLocation: {
                    lat: lights.LATITUDE_DEG,
                    lng: lights.LONGITUDE_DEG,
                  },
                  selectedLight: lights,
                  markerOpacity: 0.5,
                });
                this.sendSelectedDevice(lights);
              }}
              className="marker"
              style={{
                cursor: "pointer",
                background: this.lightColor(lights),
                opacity: this.state.markerOpacity,
              }}
            />
          ))}

          {this.state.selectedLight && (
            <div
              key={this.state.selectedLight.UTIL_DEVICE_ID}
              lat={this.state.selectedLight.LATITUDE_DEG}
              lng={this.state.selectedLight.LONGITUDE_DEG}
            >
              <div
                className="selected-marker"
                style={{
                  background: this.lightColor(this.state.selectedLight),
                }}
                onClick={() => {
                  this.setState({
                    selectedLight: null,
                    markerOpacity: 1,
                  });
                  this.sendSelectedDevice(this.state.selectedLight);
                }}
              ></div>
              <div className="marker-info-window">
                {" "}
                <text className="marker-info-window-text">
                  {this.state.selectedLight.UTIL_DEVICE_ID}
                </text>
              </div>
              {/* Below is info window component */}

              {/* <div
                className="selected-marker"
                style={{
                  background: this.lightColor(this.state.selectedLight),
                }}
              ></div>
              <div className="marker-info-window">Info window</div> */}
            </div>
          )}

          {this.state.gpsStatus && (
            <div
              lat={this.state.defaultGps.lat}
              lng={this.state.defaultGps.lng}
            >
              <img src={currentLocationMarker} alt="geolocation" />
            </div>
          )}
        </GoogleMapReact>
        <div
          className="locationReset-icon"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            this.setState({
              currentLocation: this.state.defaultGps,
            });
          }}
        >
          <FaLocationArrow className="location-icon" />
        </div>
        <div>
        {/* <DeviceInfo device={this.state.selectedLight} /> */}
       
      </div>
      {/* <div>
        <MapDeviceInfo device={this.state.selectedLight} />
      </div> */}
      </div>
    );
  }
}
export default GoogleMaps;
