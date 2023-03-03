import React from 'react'

import classes from './Amenities.module.css'

function Amenities(props) {

    const amenities = props.listing.amenities

  return (
    <div className={classes.container}>{amenities.length && amenities
        .map((amenity, index) => (
          <div key={index}>{amenity}</div>
          ))}</div>
  )
}

export default Amenities