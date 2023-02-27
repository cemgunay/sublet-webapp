import React from "react";
import { useRef, useContext, useState } from "react";
import { loginCall } from "../../loginCalls";
import { AuthContext } from "../../context/AuthContext";
import classes from "./SignUpParts.module.css";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Error from './Error';

function LogInEmail({ formData, setFormData }) {
  const email = formData.email;
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    loginCall({ email: email, password: password.current.value }, dispatch);
    console.log(user);
    if (!error) {
      navigate("/");
    } else {
      setIsError(true);
    }
  };

  return (
    <>
      { isError ? <Error/> : null}
      <form className={classes.emailcontainer} onSubmit={handleClick}>
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
