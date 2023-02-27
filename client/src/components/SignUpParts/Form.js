import React, { useState, useEffect } from "react";
import Email from "./Email";
import SignUpForm from "./SignUpForm";
import api from "../../apiCalls";

import classes from "./SignUpParts.module.css";

//npm install react-social-icons
import axios from "axios";
import Socials from "./Socials";
import LogInEmail from "./LogInEmail";

function Form({setPage, signUp, setSignUp, logIn, setLogIn}) {
  //used to toggle between phone and email (not used right now)
  const [email, setEmail] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/dummy/dummy-data-users.json")
      .then((response) => {
        console.log(response.data);
        setUser(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  //display phone if user clicks phone (changed to return nothing right now)
  const PageDisplay = () => {
    if (email === false) {
      return <Email formData={formData} setFormData={setFormData} />;
    } else {
      return <Email formData={formData} setFormData={setFormData} />;
    }
  };

  //continuation of above function to toggle between login with phone vs email
  /*
    const changeEmail = () => {
        if (email === false) {
        setEmail(true)
        } else {
        setEmail(false)
        }
    }
  */

  // On click function to check if email exists in the DB
  const handleClick = async (e) => {
    e.preventDefault();

    //Check if form is blank when user clicks continue
    if (formData.email === "") {
      return;
    }

    var hasMatch = false;
    // Check for email existance
    try {
      const email = await api.get("/users/" + formData.email);
      hasMatch = true;
    } catch (err) {
      hasMatch = false;
    }

    if (hasMatch === false) {
      setSignUp(true);
      setPage((currPage) => currPage + 1)
    } else {
      setLogIn(true);
      setPage((currPage) => currPage + 1)
    }
  };

  //onClick={() => setSignUp(true)}

  return (
    <div className={classes.container}>
      {signUp ? (
        <SignUpForm formData={formData} setFormData={setFormData} />
      ) : logIn ? (
        <LogInEmail formData={formData} setFormData={setFormData} />
      ) : (
        <>
          <form className={classes.emailcontainer} onSubmit={handleClick}>
            {PageDisplay()}
            <button className={classes.button}>
              Continue
            </button>
          </form>
          <Socials />
        </>
      )}
    </div>
  );
}

export default Form;

/*

//on email input and button click continue, check if we need to go to the sign up page or password page
const signUpForm = () => {
  if (signUp === false) {
    return <Form formData={formData} setFormData={setFormData} />;
  } else {
    return <SignUpForm formData={formData} setFormData={setFormData} />;
  }
};

//incase need to use props
//const [formData, setFormData] = useState(props.formData)

*/
