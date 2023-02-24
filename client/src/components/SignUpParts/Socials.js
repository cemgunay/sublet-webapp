import React from 'react'

import classes from "./SignUpParts.module.css";

import { SocialIcon } from "react-social-icons";

function Socials() {
  return (
    <>
    <div className={classes.seperator}>
            <div className={classes.seperatorText}>Or</div>
          </div>
          <div className={classes.socialsList}>
            <div className={classes.socials}>
              <SocialIcon url="https://facebook.com" />
              Continue with Facebook
            </div>
            <div className={classes.socials}>
              <SocialIcon url="https://google.com" />
              Continue with Google
            </div>

            {/*

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

          */}

            <div className={classes.socials}>
              <SocialIcon url="https://apple.com" />
              Continue with Apple
            </div>
          </div></>
    
  )
}

export default Socials