import React from "react";
import { useRef, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import classes from "./SignUpParts.module.css";
import { CircularProgress } from "@mui/material";

import Error from "./Error";

import axios from "../../api/axios";
const BASE_URL = 'auth/login'

function LogInEmail({ formData, setFormData }) {
  
  //get email data from previous page
  const email = formData.email;

  //get password entered from below form with ref
  const password = useRef();

  //authcontext stuff
  //const { user, error } = useContext(AuthContext)
  const { isFetching } = useContext(AuthContext)

  //to conditionally render wrong password popup div
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate();

  //on submit use api to check if passwords match
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
      {isError ? <Error /> : null}
        <input
          className={classes.email}
          type="password"
          placeholder="Password"
          autoComplete="on"
          ref={password}
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
