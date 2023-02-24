import React, { useRef } from 'react'

import classes from './SignUpParts.module.css'

function Third() {

  const ref = useRef();

  return (
    <div className={classes.container}>
      <form>
        <div className={classes.container}>
          <input className={classes.email} type='text' placeholder='First Name'></input>
          <input className={classes.email} type='text' placeholder='Last Name'></input>
          <div className={classes.text}>Make sure it matches the name of your Government ID</div>
          <input className={classes.email} type='text' placeholder='Birthday' onFocus={() => (ref.current.type = "date")} onBlur={() => (ref.current.type = "date")}></input>
          <div className={classes.text}>To sign up you must be atleast 18 years of age</div>
          <input className={classes.email} type='email' placeholder='Email'></input>
          <div className={classes.text}>We'll email you contract confirmation and receipts</div>
          <input className={classes.email} type='password' placeholder='Password'></input>
          <div className={classes.text}>Password strength excellent</div>
          <div className={classes.conditions}>By selecting Agree and Continue. I agree to subLet's Terms of service, Payments Terms of Service, Nondiscrimination Policy, and Privacy Policy</div>
          <button className={classes.button}> Agree and Continue</button>
        </div>
      </form>
    </div>
  )
}

export default Third