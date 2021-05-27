const DeviceInfo = ({ device }) => {
  function valueChecker(value) {
    if (value == null) {
      return "Not Available";
    }
    return value;
  }

  const state = (device) => {
    if (device.INSTANT_POWER > 0) {
      return (
        <p>
          <strong>Device State : </strong> <p className="status-on"> On </p>
        </p>
      );
    } else if (device.INSTANT_POWER === 0) {
      return (
        <p>
          <strong>Device State : </strong>
          <p className="status-off"> Off </p>
        </p>
      );
    } else {
      return (
        <p>
          <strong>Device State : </strong>
          <p className="status-fault"> Faulty </p>
        </p>
      );
    }
  };
  return (
    <div className="infoTab border-left">
      <h2 style={{ style: "open sans" }}>Device Information</h2>
      <br></br>
      {device && (
        <ul>
          <p>
            <strong>Device ID : </strong>{" "}
            <p> {valueChecker(device.UTIL_DEVICE_ID)} </p>
          </p>
          {state(device)}
          <p>
            <strong>Mac Address : </strong>
            <p> {valueChecker(device.NIC_MAC_ID)} </p>
          </p>
          <p>
            <strong>Device State : </strong>
            <p> {valueChecker(device.UIQ_DEVICE_STATE)} </p>
          </p>
          <p>
            <strong>IP Address : </strong>
            <p> {valueChecker(device.IP_ADDRESS)} </p>
          </p>
          <p>
            <strong>Latitude : </strong>
            <p> {valueChecker(device.LATITUDE_DEG)} </p>
          </p>
          <p>
            <strong>Longitude : </strong>
            <p>{valueChecker(device.LONGITUDE_DEG)}</p>
          </p>
          <p>
            <strong>Insert TS : </strong>
            <p>{valueChecker(device.INSERT_TS)}</p>
          </p>
          <p>
            <strong>Premise ID : </strong>
            <p> {valueChecker(device.PREMISE_ID)} </p>
          </p>
          <p>
            <strong>Address : </strong>
            <p>{valueChecker(device.ADDRESS1)}</p>
          </p>
          <p>
            <strong>Instant Voltage : </strong>
            <p>{valueChecker(device.INSTANT_VOLTAGE)}</p>
          </p>
          <p>
            <strong>Energy Delicvered : </strong>
            <p>{valueChecker(device.ENERGY_DELIVERED)}</p>
          </p>
          <p>
            <strong>Current Magnitude : </strong>
            <p>{valueChecker(device.CURRENT_MAGNITUDE)}</p>
          </p>
        </ul>
      )}
    </div>
  );
};

export default DeviceInfo;
