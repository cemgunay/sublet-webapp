import React from "react";

import classes from "./Amenities.module.css";

function Amenities(props) {
  const amenities = [];

  for (const amenity in props.listing.amenities) {
    if (props.listing.amenities[amenity] === true) {
      amenities.push(amenity);
    }
  }

  return (
    <div className={classes.container}>
      {amenities.length &&
        amenities.map((amenity, index) => <div key={index}>{amenity}</div>)}
    </div>
  );
}

export default Amenities;
