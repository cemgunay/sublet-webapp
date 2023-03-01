import React from 'react'

import classes from './EmailChanged.module.css'

function EmailChanged() {
  return (
    <div className={classes.emailchanged}>
      <div className={classes.text}>Looks like you already have an account, please log in.</div>
    </div>
  )
}

export default EmailChanged