import React, {useState} from 'react'
import First from '../../components/SignUpParts/First'
import Second from '../../components/SignUpParts/Second'

import classes from '../../pages/signup/SignUp.module.css'

//npm install react-social-icons
import { SocialIcon } from 'react-social-icons'

function Form(props) {

    const [email, setEmail] = useState(false);

    const PageDisplay = () => {
        if (email === false) {
        return <First />;
        } else {
        return <Second />;
        }
    }

    const changeEmail = () => {
        if (email === false) {
        setEmail(true)
        } else {
        setEmail(false)
        }
    }

  return (
    <div className={classes.container}>
          {PageDisplay()}
          <button className={classes.button} onClick={() => props.changeSignUp(true)}>Continue</button>
          <div className={classes.seperator}>
            <div className={classes.seperatorText}>Or</div>
          </div>
          <div className={classes.socialsList}>
            <div className={classes.socials}>
              <SocialIcon url='https://facebook.com' />
              Continue with Facebook
            </div>
            <div className={classes.socials}>
              <SocialIcon url='https://google.com' />
              Continue with Google
            </div>
            { email ? 
            <div className={classes.socials} onClick={changeEmail}>
              <SocialIcon url='phone' />
              Continue with Phone
            </div> : 
            <div className={classes.socials} onClick={changeEmail}>
              <SocialIcon url='email' />
              Continue with Email
            </div>
            }
            <div className={classes.socials}>
              <SocialIcon url='https://apple.com' />
              Continue with Apple
            </div>
          </div>
        </div>
  )
}

export default Form