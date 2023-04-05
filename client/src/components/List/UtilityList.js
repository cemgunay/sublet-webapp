import React from 'react'
import UtilityItem from './UtilityItem'

import classes from './UtilityList.module.css'

function UtilityList(props) {

    console.log(props.data.utilities)

  return (
    <div className={classes.container}>
      {props.data.utilities &&
        Object.keys(props.data.utilities).map((utility, index) => (
          <UtilityItem
            key={index}
            index={index}
            utilityName={utility}
            utilityValue={props.data.utilities[utility]}
            handleChange={props.handleChange}
          />
        ))}
    </div>
  )
}

export default UtilityList