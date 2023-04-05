import React from 'react'

import classes from './UtilityItem.module.css'

function UtilityItem(props) {

  return (
    <div className={classes.utilityItem}>
      <input
        id={props.utilityName}
        type="checkbox"
        name={props.utilityName}
        value={props.utilityName}
        checked={props.utilityValue}
        onChange={props.handleChange}
      />
      <label className={classes.utilitySelection} htmlFor={props.utilityName}>
        {props.utilityName}
      </label>
    </div>
  )
}

export default UtilityItem