import React from "react";
import { useRef, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import classes from "./LogInEmail.module.css";
import { CircularProgress } from "@mui/material";

import Error from "../Error";
import EmailChanged from "./EmailChanged";

import axios from "../../../api/axios";
import FormInput from "../FormInput";
const BASE_URL = "auth/login";

function LogInEmail({ formData, setFormData, emailChangedToMatch }) {
  //get email data from previous page
  const email = formData.email;

  //get password entered from below form with ref
  const password = useRef();

  //authcontext stuff
  //const { user, error } = useContext(AuthContext)
  const { isFetching } = useContext(AuthContext);

  //to conditionally render wrong password popup div
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  //on submit use api to check if passwords match, if so, log in user (need nino to confirm this)
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BASE_URL, {
        email: email,
        password: password.current.value,
      });
      console.log(response.data);
      navigate("/");
    } catch (error) {
      setIsError(true);
    }
  };

  return (
    <>
      <form className={classes.emailcontainer} onSubmit={handleClick}>
        {emailChangedToMatch ? <EmailChanged /> : null}
        {isError ? <Error /> : null}
        {}
        <FormInput
          className={classes.input}
          type="password"
          placeholder="Password"
          autoComplete="on"
          innerRef={password}
        />
        <button className={classes.button} type="submit">
          {isFetching ? <CircularProgress size="20px" /> : "Log In"}
        </button>
      </form>
      <div>Forgot Password?</div>
    </>
  );
}

export default LogInEmail;
