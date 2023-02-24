import React, { useRef } from 'react'
import classes from './SignUp.module.css'
import api from '../../apiCalls';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignUpForm() {

  const firstName = useRef();
  const lastName = useRef();
  const dateOfBirth = useRef();
  const email = useRef();
  const location = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();


  const handleClick = async (e) => {
    
    e.preventDefault();

    if(passwordAgain.current.value !== password.current.value)
    {
      password.current.setCustomValidity("Passwords don't match...")
    } 
    else
    {
      const user = {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        email: email.current.value,
        password: password.current.value,
        dateOfBirth: dateOfBirth.current.value,
        location: location.current.value,
      };

      try
      {
        await api.post("/auth/register", user);
        console.log(user);
        navigate("/");
      }
      catch (err)
      {
        console.log(err);
      }
    }
  }

  return (
    <div className={classes.container}>
      <form onSubmit={handleClick}>
        <div className={classes.container}>
          <input className={classes.email} type='text' placeholder='First Name'  ref={firstName}></input>
          <input className={classes.email} type='text' placeholder='Last Name' ref={lastName}></input>
          <div className={classes.text}>Make sure it matches the name of your Government ID</div>
          <input className={classes.email} type='date' placeholder='Birthday' ref={dateOfBirth}></input>
          <div className={classes.text}>To sign up you must be atleast 18 years of age</div>
          <input className={classes.email} type='email' placeholder='Email' ref={email}></input>
          <div className={classes.text}>We'll email you contract confirmation and receipts</div>
          <input className={classes.email} type='text' placeholder='Location' ref={location}></input>
          <div className={classes.text}>Where are you located?</div>
          <input className={classes.email} type='password' placeholder='Password' ref={password}></input>
          <input className={classes.email} type='password' placeholder='Password Again' ref={passwordAgain}></input>
          <div className={classes.text}>Ensure passwords match up!</div>
          <div className={classes.conditions}>By selecting Agree and Continue. I agree to subLet's Terms of service, Payments Terms of Service, Nondiscrimination Policy, and Privacy Policy</div>
          <button className={classes.button} type='submit'> Agree and Continue</button>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm;
