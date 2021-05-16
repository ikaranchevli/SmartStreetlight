import React from "react";
import DataTable from "react-data-table-component";
import { helpers, DeviceStatus } from "../helpers/history";
import "./List/List.css";

const List = (props) => {

  const [hideDirector, setHideDirector] = React.useState(false);

  const statusDisplay = (device) => {
    var today = new Date();
    var curHr = today.getHours();
    var count = 0;

    var status = helpers.getStatusOfDeviceNew(device);
    switch (status) {
      case DeviceStatus.ON:
        return <div>
          <span className="bulbIconCustom ON">
            <i className="fa fa-lightbulb"></i>
          </span>
          <span className="customTextTable">Switched On</span>
        </div>;
      case DeviceStatus.OFF:
        return <div>
          <span className="bulbIconCustom OFF">
            <i className="fa fa-lightbulb"></i>
          </span>
          <span className="customTextTable">Switched Off</span>
        </div>;
      case DeviceStatus.FAULTY:
        return <div>
          <span className="bulbIconCustom FAULTY">
            <i className="fa fa-lightbulb"></i>
          </span>
          <span className="customTextTable">Faulty/ Unknown</span>
        </div>;
      case DeviceStatus.UNREACHABLE:
        return <div>
          <span className="bulbIconCustom UNREACHABLE">
            <i className="fa fa-lightbulb"></i>
          </span>
          <span className="customTextTable">Unreachable</span>
        </div>;
      case DeviceStatus.NEW:
        return <div>
          <span className="bulbIconCustom TO_BE_INSTALLED">
            <i className="fa fa-lightbulb"></i>
          </span>
          <span className="customTextTable">To be Installed</span>
        </div>;
      default:
        return <div>
          <span className="bulbIconCustom FAULTY">
            <i className="fa fa-lightbulb"></i>
          </span>
          <span className="customTextTable">Faulty/ Unknown</span>
        </div>;
    }
  };


  const columns = React.useMemo(() => [
    {
      name: 'Device ID',
      selector: 'UTIL_DEVICE_ID',
      sortable: true,
    },
    {
      name: 'Status',
      sortable: true,
      cell: row => statusDisplay(row),
      minWidth: '200px'
    },
    {
      name: 'Address',
      selector: 'ADDRESS1',
      sortable: true,
      minWidth: '280px'
    },
    {
      name: 'Longitude',
      selector: 'LONGITUDE_DEG',
      sortable: true,

    },
    {
      name: 'Latitude',
      selector: 'LATITUDE_DEG',
      sortable: true,

    },
    {
      name: 'Voltage',
      selector: 'INSTANT_VOLTAGE',
      sortable: true,

    },
    {
      name: 'Energy',
      selector: 'ENERGY_DELIVERED',
      sortable: true,

    },
    {
      name: 'Current',
      selector: 'CURRENT_MAGNITUDE',
      sortable: true,
    },
    {
      name: 'Area Code',
      selector: 'AREA_CODE',
      sortable: true,
    },
  ], [hideDirector]);

  return (
    <div className="list">
      <DataTable
        columns={columns}
        minWidth = {400}
        data={props.data}
        pagination = {true}
        noHeader = {true}
        responsive = {true}
        paginationPerPage = {10}
        paginationRowsPerPageOptions = {[10, 15, 50]}
      />
    </div>
  );
};

export default List;
