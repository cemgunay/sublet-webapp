import React from 'react'

import classes from './TopBar.module.css'

function TopBar() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.save}>
            Save & Exit
        </div>
        <div className={classes.questions}>
            Questions
        </div>
    </div>
    </div>
    
  )
}

export default TopBar