import React, { useEffect, useRef, useState } from "react";
import classes from "./SignUpForm.module.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import { passwordStrength as passwordStrengthFunction } from "check-password-strength";
import FormInput from "./FormInput";

function SignUpForm({ formData, setFormData, logIn, setLogIn, signUp, setSignUp, setEmailChangedToMatch }) {
  
  const navigate = useNavigate();

  //useRefs for form
  const firstName = useRef();
  const lastName = useRef();
  const dateOfBirth = useRef();
  const email = useRef();
  const location = useRef();
  const password = useRef();

  //password check variables (this is lowkey bad practice, should do an object like formData)
  const [passwordLength, setPasswordLength] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(false);
  const [passwordContainsName, setPasswordContainsName] = useState(false);
  const [passwordContainsNumber, setPasswordContainsNumber] = useState(false);

  //change if all password checks are met, used for disabling button
  const [passAllChecks, setPassAllChecks] = useState(false);

  //set the passAllChecks

  useEffect(() => {
    if (
      passwordStrength &&
      passwordContainsName &&
      passwordContainsNumber &&
      passwordLength >= 8
    ) {
      setPassAllChecks(true);
    } else {
      setPassAllChecks(false);
    }
  }, [
    passwordStrength,
    passwordContainsName,
    passwordContainsNumber,
    passwordLength,
  ]);

  //function to see if string contains numbers
  function containsNumbers(str) {
    return /\d/.test(str);
  }

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnChangePassword = (e) => {
    setFormData({ ...formData, password: e.target.value });

    setPasswordLength(e.target.value.length);

    if (
      e.target.value.includes(formData.firstName) ||
      e.target.value.includes(formData.lastName) ||
      e.target.value.includes(formData.email)
    ) {
      setPasswordContainsName(true);
    } else {
      setPasswordContainsName(false);
    }

    if (containsNumbers(e.target.value)) {
      setPasswordContainsNumber(true);
    } else {
      setPasswordContainsNumber(false);
    }

    if (passwordStrengthFunction(e.target.value).id >= 2) {
      setPasswordStrength(true);
    } else {
      setPasswordStrength(false);
    }
  };

  //register user
  const handleSubmit = async (e) => {
    e.preventDefault();

    await checkIfUserExists(formData);

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
  const checkIfUserExists = async (formData) => {

    // Check for email existance
    try {
      await api.get("/users/" + formData.email.toLowerCase());
      setLogIn(true);
      setSignUp(false);
      setEmailChangedToMatch(true)
    } catch (err) {
    }
  }

  return (
    <form onSubmit={handleSubmit} className={classes.formcontainer}>
      <FormInput
        name="firstName"
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleOnChange}
        errorMessage="Your first name can't be empty or contain an unsopported character"
        pattern="^[A-Za-z0-9]{1,150}$"
        innerRef={firstName}
      />
      <FormInput
        className={classes.input}
        name="lastName"
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleOnChange}
        innerRef={lastName}
        errorMessage="Your last name contains an unsopported character. Try spelling it differently"
        pattern="^[A-Za-z0-9]{1,150}$"
        text="Make sure it matches the name of your Government ID"
        classNameSpan={classes.text}
      />
      <FormInput
        className={classes.input}
        name="dateOfBirth"
        type="text"
        placeholder="Birthday"
        value={formData.dateOfBirth}
        onChange={handleOnChange}
        onFocus={(e) => {
          e.currentTarget.type = "date";
          e.currentTarget.focus();
        }}
        innerRef={dateOfBirth}
        text="To sign up you must be atleast 18 years of age"
        classNameSpan={classes.text}
      />
      <FormInput
        className={classes.input}
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleOnChange}
        innerRef={email}
        errorMessage="Please enter a valid email address"
        text="We'll email you contract confirmation and receipts"
        classNameSpan={classes.text}
      />
      <FormInput
        className={classes.input}
        name="location"
        type="address"
        placeholder="Location"
        value={formData.location}
        onChange={handleOnChange}
        innerRef={location}
        text="Where are you located?"
        classNameSpan={classes.text}
      />

      <div className={classes.password}>
        <FormInput
          className={classes.input}
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleOnChangePassword}
          innerRef={password}
        />
        <div
          className={
            formData.password.length > 0
              ? classes.passwordchecklist
              : classes.hide
          }
        >
          <li className={passwordStrength ? classes.true : classes.false}>
            Password Strength:
            {passwordStrengthFunction(formData.password).value}
          </li>
          <li className={!passwordContainsName ? classes.true : classes.false}>
            Can't contain your name or email address
          </li>
          <li className={passwordLength >= 8 ? classes.true : classes.false}>
            At least 8 characters
          </li>
          <li className={passwordContainsNumber ? classes.true : classes.false}>
            Contains a number or symbol
          </li>
        </div>
      </div>

      <div className={classes.conditions}>
        By selecting Agree and Continue. I agree to subLet's Terms of service,
        Payments Terms of Service, Nondiscrimination Policy, and Privacy Policy
      </div>
      <button className={classes.button} disabled={passAllChecks} type="submit">
        {" "}
        Agree and Continue
      </button>
    </form>
  );
}

export default SignUpForm;

/*

<div
          className={
            formData.password.length > 0
              ? classes.passwordchecklist
              : classes.hide
          }
        >
          <li className={passwordStrength ? classes.true : classes.false}>
            Password Strength:
            {passwordStrengthFunction(formData.password).value}
          </li>
          <li className={!passwordContainsName ? classes.true : classes.false}>
            Can't contain your name or email address
          </li>
          <li className={passwordLength >= 8 ? classes.true : classes.false}>
            At least 8 characters
          </li>
          <li className={passwordContainsNumber ? classes.true : classes.false}>
            Contains a number or symbol
          </li>
        </div>

        */
