import React from 'react'
import AmenityItem from './AmenityItem'

import classes from './AmenityList.module.css'

function AmenityList(props) {

    console.log(props.data.amenities)

  return (
    <div className={classes.container}>
      {props.data.amenities &&
        Object.keys(props.data.amenities).map((amenity, index) => (
          <AmenityItem
            key={index}
            index={index}
            amenityName={amenity}
            amenityValue={props.data.amenities[amenity]}
            handleChange={props.handleChange}
          />
        ))}
    </div>
  )
}

export default AmenityList