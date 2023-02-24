import React from 'react'

import classes from './SignUp.module.css'

function Email() {
  return (
    <div className={classes.container}>
      <form>
        <div >
          <input className={classes.email} type='email' placeholder='Email'></input>
        </div>
      </form>
    </div>
  )
}

export default Email