import "./SearchBar/SearchBar.css";
import { useState } from "react";
import { ImMap } from "react-icons/im";
import { BsCardList } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { Input, Tooltip, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const SearchBar = (props) => {
  const [mapIcon, setMapIcon] = useState("");
  const [listIcon, setListIcon] = useState("#006ab1");
  const [councilFilterDefault, setCouncilFilterDefault] =
    useState("Select Suburb");
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

  const onSearch = (value) => {
    if (value) {
      props.device(value);
    }
  };

  const councilList = [
    "ALL",
    "KENSINGTON",
    "ASCOT VALE",
    "NORTH MELBOURNE",
    "FLEMINGTON",
  ];

  const councils = councilList.map((council) => {
    return <Option value={council}>{council}</Option>;
  });

  return (
    <>
      <div className="search-bar-pane">
        <div className="toggle-switch-area">
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
        <div className="search-bar-area">
          <Search
            placeholder="Enter Device ID"
            allowClear
            onSearch={onSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="status-header-area">Select Status:</div>
        <div className="status-filter-area">
          <Select
            style={{ width: "80%" }}
            defaultValue={"ALL"}
            onChange={(value) => {
              props.statusFilter(value);
            }}
          >
            <Option value="ALL">ALL</Option>
            <Option value={0}>ON</Option>
            <Option value={6}>OFF</Option>
            <Option value={null}>UNREACHABLE</Option>
            {/* <Option value="Unreachable">UNREACHABLE</Option> */}
            <Option value="New">TO BE INSTALLED</Option>
          </Select>
        </div>
        <div className="council-header-area">Select Suburb:</div>
        <div className="council-filter-area">
          <Select
            style={{ width: "80%" }}
            defaultValue={"ALL"}
            onChange={(value) => {
              props.councilFilter(value);
            }}
          >
            {councils}
          </Select>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
