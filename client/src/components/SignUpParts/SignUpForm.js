import React, { useEffect, useRef, useState } from "react";
import classes from "./SignUpParts.module.css";
import api from '../../api/axios'
import { useNavigate } from "react-router-dom";

import { passwordStrength } from 'check-password-strength'

function SignUpForm({ formData, setFormData }) {

  const navigate = useNavigate();

  //use refs for forum
  const firstName = useRef();
  const lastName = useRef();
  const dateOfBirth = useRef();
  const email = useRef();
  const location = useRef();
  const password = useRef();

  //password check variables
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passStrength, setPassStrength] = useState(false);
  const [passName, setPassName] = useState(true);
  const [passCharacters, setPassCharacters] = useState(false);
  const [passNumber, setPassNumber] = useState(false);

  //change if all password checks are met, used for disabling button
  const [passAllChecks, setPassAllChecks] = useState(false);
  
  //set the passAllChecks
  useEffect(() => {
    if (passStrength && passCharacters && passNumber && !passName){
      setPassAllChecks(true)
    } else {
      setPassAllChecks(false)
    }
  }, [passCharacters, passName, passNumber, passStrength]); 

   //all below for password checks
   const handleOnChangeFirstName = (e) => {
    setFormData({ ...formData, firstName: e.target.value })
  }

  const handleOnChangeLastName = (e) => {
    setFormData({ ...formData, lastName: e.target.value })
  }

  function containsNumbers(str) {
    return /\d/.test(str);
  }

  const handleOnChange = (e) => {
    setPasswordCheck(e.target.value)
    if(e.target.value.length >= 8){
      setPassCharacters(true)
    } else {
      setPassCharacters(false)
    }
    if(e.target.value.includes(formData.firstName) || e.target.value.includes(formData.lastName) || e.target.value.includes(formData.email) ){
      setPassName(false)
    } else {
      setPassName(true)
    }
    if(containsNumbers(e.target.value)){
      setPassNumber(true)
    } else {
      setPassNumber(false)
    }
    if(passwordStrength(e.target.value).id >= 2){
      setPassStrength(true)
    } else {
      setPassStrength(false)
    }
    
  }

  //login user
  const handleClick = async (e) => {
    e.preventDefault();
    
      const user = {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        email: email.current.value,
        password: password.current.value,
        dateOfBirth: dateOfBirth.current.value,
        location: location.current.value,
      };

      try {
        await api.post("/auth/register", user);
        console.log(user);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
  };


  //if user changes the email ine the sign up form, redirect them to log in page (and maybe also add a div that says account exists)


  return (
      <form onSubmit={handleClick} className={classes.formcontainer}>
        <input
          className={classes.email}
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleOnChangeFirstName}
          ref={firstName}
        ></input>
        <input
          className={classes.email}
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleOnChangeLastName}
          ref={lastName}
        ></input>
        <div className={classes.text}>
          Make sure it matches the name of your Government ID
        </div>
        <input
          className={classes.email}
          type="text"
   onFocus={
    (e)=> {
      e.currentTarget.type = "date";
      e.currentTarget.focus();
     }
   }
   placeholder="Birthday"
          ref={dateOfBirth}
        ></input>
        <div className={classes.text}>
          To sign up you must be atleast 18 years of age
        </div>
        <input
          className={classes.email}
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(event) => setFormData({...formData, email: event.target.value})}
          ref={email}
        ></input>
        <div className={classes.text}>
          We'll email you contract confirmation and receipts
        </div>
        <input
          className={classes.email}
          type="text"
          placeholder="Location"
          ref={location}
        ></input>
        <div className={classes.text}>Where are you located?</div>
        <div className={classes.password}>
        <input
          className={classes.email}
          type="password"
          placeholder="Password"
          ref={password}
          onChange={handleOnChange}
        ></input>
        <div className={passwordCheck.length > 0 ? classes.passwordchecklist : classes.hide}>
          <li className={passStrength ? classes.true : classes.false}>
          {passwordStrength(passwordCheck).value}
          </li>
          <li className={passName ? classes.true : classes.false}>
            Can't contain your name or email address
          </li>
          <li className={passCharacters ? classes.true : classes.false}>
            At least 8 characters
          </li>
          <li className={passNumber ? classes.true : classes.false}>
            Contains a number or symbol
          </li>
        </div>
        </div>
        <div className={classes.conditions}>
          By selecting Agree and Continue. I agree to subLet's Terms of service,
          Payments Terms of Service, Nondiscrimination Policy, and Privacy
          Policy
        </div>
        <button className={classes.button} disabled={passAllChecks} type="submit">
          {" "}
          Agree and Continue
        </button>
      </form>
  );
}

export default SignUpForm;