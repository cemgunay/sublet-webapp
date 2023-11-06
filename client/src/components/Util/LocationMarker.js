import React from "react";
import classes from "./LocationMarker.module.css";

function LocationMarker(props) {
  const { lat, lng } = props;

  return (
    <div className={classes.container}>
      <img
        src={`http://localhost:8080/server/maps/map-image?lat=${lat}&lng=${lng}`}
        alt="Map"
      />
    </div>
  );
}

export default LocationMarker;
