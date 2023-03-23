import React from 'react'

import classes from './TopBar.module.css'

function TopBar() {
  return (
    <div className={classes.container}>
        <div className={classes.save}>
            Save & Exit
        </div>
        <div className={classes.questions}>
            Questions
        </div>
    </div>
  )
}

export default TopBar