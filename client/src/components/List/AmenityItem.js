import React from 'react'

import classes from './AmenityItem.module.css'

function AmenityItem(props) {
  
  return (
    <div className={classes.amenityItem}>
      <input
        id={props.amenityName}
        type="checkbox"
        name={props.amenityName}
        value={props.amenityName}
        checked={props.amenityValue}
        onChange={props.handleChange}
      />
      <label className={classes.amenitySelection} htmlFor={props.amenityName}>
        {props.amenityName}
      </label>
    </div>
  )
}

export default AmenityItem