import "./SearchBar/SearchBar.css";
import { useState } from "react";
import { ImMap } from "react-icons/im";
import { BsCardList } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

const SearchBar = (props) => {
  const [mapIcon, setMapIcon] = useState("#006ab1");
  const [listIcon, setListIcon] = useState("");
  const [councilFilterDefault, setCouncilFilterDefault] =
    useState("Select Council");
  const [councilFilterMenu, setCouncilFilterMenu] = useState(false);
  const [statusFilterDefault, setStatusFilterDefault] =
    useState("Select Status");
  const [statusFilterMenu, setStatusFilterMenu] = useState(false);
  const [searchDevice, setSearchDevice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Submitting ID: ${searchDevice}`);
    props.device(searchDevice);
  };

  return (
    <>
      <div className="search-bar-pane">
        <div className="toggle-switch-area">
          <div className="toggle-switch-button-area">
            <label className="switch">
              <div className="slider">
                <div className="map-view" type="checkbox">
                  <ImMap
                    className="map-icon"
                    color={mapIcon}
                    onClick={() => {
                      setMapIcon("#006ab1");
                      setListIcon("");
                      props.view("map");
                    }}
                  />
                </div>
                <div className="list-view">
                  <BsCardList
                    className="list-icon"
                    color={listIcon}
                    onClick={() => {
                      setMapIcon("");
                      setListIcon("#006ab1");
                      props.view("list");
                    }}
                  />
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="search-bar-area">
          <div className="search-bar">
            <form onSubmit={handleSubmit}>
              <div className="search-bar-form">
                <input
                  placeholder="Search using Device ID"
                  className="search-bar-text-area"
                  type="text"
                  value={searchDevice}
                  onChange={(e) => setSearchDevice(e.target.value)}
                ></input>
              </div>
              <div className="search-bar-icon-area">
                <input type="submit" className="search-bar-submit"></input>
                <IoSearchSharp className="search-bar-icon"></IoSearchSharp>
              </div>
            </form>
          </div>
        </div>
        <div className="status-filter-area">
          <div
            className="filter-input"
            onClick={() => {
              setStatusFilterMenu(!statusFilterMenu);
            }}
          >
            <div className="filter-default-text">
              <p>{statusFilterDefault}</p>
            </div>
            <div className="filter-default-arrow">
              <IoMdArrowDropdown />
            </div>
            {statusFilterMenu && (
              <div className="filter-dropdown-menu">
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("All");
                    props.statusFilter("All");
                  }}
                >
                  All
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("Faulty/Unknown");
                    props.statusFilter(null);
                  }}
                >
                  Faulty/Unkown
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("On");
                    props.statusFilter(1);
                  }}
                >
                  On
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("Off");
                    props.statusFilter(0);
                  }}
                >
                  Off
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("Unreachable");
                    props.statusFilter("Unreachable");
                  }}
                >
                  Unreachable
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("To be Installed");
                    props.statusFilter("New");
                  }}
                >
                  To be Installed
                </p>
                {/* <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setStatusFilterDefault("Unknown");
                    props.statusFilter("Unknown");
                  }}
                >
                  Unknown
                </p> */}
              </div>
            )}
          </div>
        </div>
        <div className="council-filter-area">
          <div
            className="filter-input"
            onClick={() => {
              setCouncilFilterMenu(!councilFilterMenu);
            }}
          >
            <div className="filter-default-text">
              <p>{councilFilterDefault}</p>
            </div>
            <div className="filter-default-arrow">
              <IoMdArrowDropdown />
            </div>
            {councilFilterMenu && (
              <div className="filter-dropdown-menu">
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setCouncilFilterDefault("All");
                    props.councilFilter("All");
                  }}
                >
                  All
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setCouncilFilterDefault("3000");
                    props.councilFilter("3000");
                  }}
                >
                  3000
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setCouncilFilterDefault("3001");
                    props.councilFilter("3001");
                  }}
                >
                  3001
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setCouncilFilterDefault("3002");
                    props.councilFilter("3002");
                  }}
                >
                  3002
                </p>
                <p
                  className="filter-dropdown-menu-item"
                  onClick={() => {
                    setCouncilFilterDefault("3003");
                    props.councilFilter("3003");
                  }}
                >
                  3003
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
