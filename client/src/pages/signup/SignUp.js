import React from 'react'
import BottomNav from '../../components/BottomNav/BottomNav';
import Form from '../../components/SignUpParts/Form'

import classes from './SignUp.module.css'

function SignUp() {

  return (
    <>
    <section className={classes.wrapper}>
      <div className={classes.title}>Login or sign up</div>
      <div className={classes.container}>
        <div className={classes.welcome}>Welcome to subLet</div>
        <Form />
      </div>
    </section>
    <footer>
      <BottomNav />
    </footer>
    </>
  )
}

export default SignUp

//{signUpForm()}