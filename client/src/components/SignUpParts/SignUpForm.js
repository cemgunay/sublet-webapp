import React, { useEffect, useRef, useState } from "react";
import classes from "./SignUpForm.module.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import { passwordStrength as passwordStrengthFunction } from "check-password-strength";

import { usePlacesWidget } from "react-google-autocomplete";

import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

import FormInput from "./FormInput";
import Autocomplete from "../Autocomplete/Autocomplete";
import { ClipLoader } from "react-spinners";

function SignUpForm({
  setLoading,
  onUserRegistered,
  formData,
  setFormData,
  setPage,
  setSignUp,
  setEmailChangedToMatch,
  setAutoCompletedLocation,
}) {
  const navigate = useNavigate();

  //useRefs for form
  const firstName = useRef();
  const lastName = useRef();
  const dateOfBirth = useRef();
  const email = useRef();

  //To make autocomplete work needed temp location

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      console.log(place);
      setAutoCompletedLocation(place.formatted_address);
    },
    options: {
      types: ["(regions)"],
    },
  });
  const password = useRef();

  //use effect to make location work with autocomplete

  //password check variables (this is lowkey bad practice, should do an object like formData)
  const [passwordLength, setPasswordLength] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(false);
  const [passwordContainsName, setPasswordContainsName] = useState(false);
  const [passwordContainsNumber, setPasswordContainsNumber] = useState(false);
  const [
    passwordContainsSpecialCharacter,
    setPasswordContainsSpecialCharacter,
  ] = useState(false);
  const [passwordContainsUpperCase, setPasswordContainsUpperCase] =
    useState(false);

  //change if all password checks are met, used for disabling button
  const [passAllChecks, setPassAllChecks] = useState(false);

  //set the passAllChecks
  useEffect(() => {
    if (
      passwordStrength &&
      !passwordContainsName &&
      passwordContainsNumber &&
      passwordContainsSpecialCharacter &&
      passwordContainsUpperCase &&
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
    passwordContainsSpecialCharacter,
    passwordContainsUpperCase,
  ]);

  //function to see if string contains numbers
  function containsNumbers(str) {
    return /\d/.test(str);
  }

  //change values of formData on change
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //change values of password in formData on change
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

    var regexSpecial = /[ !@#$%^&*()_+\-=\]{};':"\\|,.<>?]/g;
    var regexUpper = /[A-Z]/;

    if (regexSpecial.test(e.target.value)) {
      setPasswordContainsSpecialCharacter(true);
    } else {
      setPasswordContainsSpecialCharacter(false);
    }

    if (regexUpper.test(e.target.value)) {
      setPasswordContainsUpperCase(true);
    } else {
      setPasswordContainsUpperCase(false);
    }
  };

  //register user
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setFormData({ ...formData, location: ref.current.value });

    console.log(formData);

    await checkIfUserExists(formData);

    const user = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      location: formData.location,
    };

    try {
      await api.post("/auth/register", user);
      console.log(user);
      setPage(0);
      setLoading(false);
      if (onUserRegistered) {
        // Check if the prop exists and call it
        onUserRegistered();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  //if user changes the email ine the sign up form, redirect them to log in page (and maybe also add a div that says account exists)
  const checkIfUserExists = async (formData) => {
    // Check for email existance
    try {
      await api.get("/users/" + formData.email.toLowerCase());
      setPage(0);
      setSignUp(false);
      setEmailChangedToMatch(true);
    } catch (err) {}
  };

  //will add birthday validation later (can use min and max)

  console.log(formData);

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.formcontainer}>
        {/* <Autocomplete /> */}
        <FormInput
          name="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleOnChange}
          errorMessage="Your first name can't be empty or contain an unsopported character"
          pattern="^[A-Za-z0-9]{1,150}$"
          innerRef={firstName}
          required={true}
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
          required={true}
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
          required={true}
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
          required={true}
        />
        <FormInput
          name="location"
          type="address"
          placeholder="Location"
          value={ref.place}
          innerRef={ref}
          text="Where are you located?"
          classNameSpan={classes.text}
          required={true}
        />

        <div className={classes.password}>
          <FormInput
            className={classes.input}
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,100}$"
            onChange={handleOnChangePassword}
            innerRef={password}
            required={true}
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
            {passAllChecks ? null : (
              <>
                <li
                  className={
                    !passwordContainsName ? classes.true : classes.false
                  }
                >
                  Can't contain your name or email address
                </li>
                <li
                  className={passwordLength >= 8 ? classes.true : classes.false}
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    passwordContainsNumber && passwordContainsSpecialCharacter
                      ? classes.true
                      : classes.false
                  }
                >
                  Contains a number and symbol
                </li>
                <li
                  className={
                    passwordContainsUpperCase ? classes.true : classes.false
                  }
                >
                  Contains an uppercase
                </li>
              </>
            )}
          </div>
        </div>

        <div className={classes.conditions}>
          By selecting Agree and Continue. I agree to subLet's Terms of service,
          Payments Terms of Service, Nondiscrimination Policy, and Privacy
          Policy.
        </div>
        <button className={classes.button} type="submit">
          {" "}
          Agree and Continue
        </button>
      </form>
    </>
  );
}

export default SignUpForm;

//disabled={!passAllChecks}

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
