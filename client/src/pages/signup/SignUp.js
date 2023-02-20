import React, {useState} from 'react'
import Form from '../../components/SignUpParts/Form'
import Third from '../../components/SignUpParts/Third'

import classes from './SignUp.module.css'

function SignUp() {

  const [signUp, setSignUp] = useState(false);

  const signUpForm = () => {
    if (signUp === false){
      return <Form changeSignUp={signUp => setSignUp(signUp)}/>
    } else {
      return <Third />
    }
  }

  return (
    <div>
      <div className={classes.title}>Login or sign up</div>
      <div className={classes.container}>
        <div className={classes.welcome}>Welcome to subLet</div>
        {signUpForm()}
      </div>
    </div>
  )
}

export default SignUp