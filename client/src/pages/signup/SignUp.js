import React, { useState } from "react";
import BottomNav from "../../components/BottomNav/BottomNav";
import Form from "../../components/SignUpParts/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import classes from "./SignUp.module.css";
import { ClipLoader } from "react-spinners";

function SignUp() {
  const [page, setPage] = useState(0);

  const [signUp, setSignUp] = useState(false);

  const [logIn, setLogIn] = useState(false);

  const [loading, setLoading] = useState(false);

  //will pass to form child component who will pass it to its child components (signup and login) if user changes email in signup to match one in the DB
  const [emailChangedToMatch, setEmailChangedToMatch] = useState(false);

  const handleClick = () => {
    setPage((currPage) => currPage - 1);
    setLogIn(false);
    setSignUp(false);
    setEmailChangedToMatch(false);
  };

  const handleUserRegistered = () => {
    // Reset states to show login view
    setSignUp(false);
    setLogIn(false);
  };

  console.log(page);

  return (
    <>
      {loading ? (
        <div className={classes.loadingcontainer}>
          <ClipLoader
            color={"#61C0BF"}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <section className={classes.wrapper}>
            <div className={classes.titlecontainer}>
              {page >= 1 ? (
                <FontAwesomeIcon
                  className={classes.back}
                  icon={faChevronLeft}
                  onClick={handleClick}
                />
              ) : null}
              <p className={classes.title}>Login or sign up</p>
            </div>
            <div className={classes.container}>
              <div className={classes.welcome}>Welcome to subLet</div>
              <Form
                setLoading={setLoading}
                onUserRegistered={handleUserRegistered}
                setPage={setPage}
                signUp={signUp}
                setSignUp={setSignUp}
                logIn={logIn}
                setLogIn={setLogIn}
                emailChangedToMatch={emailChangedToMatch}
                setEmailChangedToMatch={setEmailChangedToMatch}
              />
            </div>
          </section>
          <footer>
            <BottomNav />
          </footer>
        </>
      )}
    </>
  );
}

export default SignUp;

//{signUpForm()}
