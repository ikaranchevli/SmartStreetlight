const MapDeviceInfo = ({ device }) => {
  function valueChecker(value) {
    if (value == null) {
      return "Not Available";
    }
    return value;
  }

  const state = (device) => {
    if (device.INSTANT_POWER > 0) {
      return <text className="status-on"> On </text>;
    } else if (device.INSTANT_POWER == 0) {
      return <text className="status-off"> Off </text>;
    } else {
      return <text className="status-fault"> Faulty </text>;
    }
  };
  return (
    <footer class="bg-light text-center text-lg-start fixed-bottom">
      <br />
      <div>
        <h5>Device Information</h5>
        {device && (
          <table className="table table-sm mytable">
            <thead>
              <tr>
                <th scope="col">Device Id</th>
                <th scope="col">Device_State</th>
                <th scope="col">Mac Address</th>
                <th scope="col">State</th>
                <th scope="col">IP_Address</th>
                <th scope="col">Latitude</th>
                <th scope="col">Longitude</th>
                <th scope="col">TS</th>
                <th scope="col">Premise_ID</th>
                <th scope="col">Address</th>
                <th scope="col">Instant_Voltage</th>
                <th scope="col">Energy</th>
                <th scope="col">Magnitude</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{valueChecker(device.UTIL_DEVICE_ID)}</td>
                <td>{state(device)}</td>
                <td>{valueChecker(device.NIC_MAC_ID)}</td>
                <td>{valueChecker(device.UIQ_DEVICE_STATE)}</td>
                <td>{valueChecker(device.IP_ADDRESS)}</td>
                <td>{valueChecker(device.LATITUDE_DEG)}</td>
                <td>{valueChecker(device.LONGITUDE_DEG)}</td>
                <td>{valueChecker(device.INSERT_TS)}</td>
                <td>{valueChecker(device.PREMISE_ID)}</td>
                <td>{valueChecker(device.ADDRESS1)}</td>
                <td>{valueChecker(device.INSTANT_VOLTAGE)}</td>
                <td>{valueChecker(device.ENERGY_DELIVERED)}</td>
                <td>{valueChecker(device.CURRENT_MAGNITUDE)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </footer>
  );
};

export default MapDeviceInfo;
