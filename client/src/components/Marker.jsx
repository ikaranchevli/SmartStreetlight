import React from "react";

const Marker = (powerLevel) => {
  function powerStatus(powerLevel) {
    if (powerLevel > 0) {
      return "#2ecc71";
    } else if (powerLevel === 0) {
      return "#f1c40f";
    } else {
      return "#e74c3c";
    }
  }

  return <div className="marker" color={powerStatus(powerLevel)} />;
};

export default Marker;
