import React, { useState } from 'react'
import BottomNav from '../../components/BottomNav/BottomNav'
import Form from '../../components/SignUpParts/Form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import classes from './SignUp.module.css'

function SignUp() {

  console.log('hello')

  const [page, setPage] = useState(0)

  console.log(page)

  const [signUp, setSignUp] = useState(false);

  const [logIn, setLogIn] = useState(false);

  const handleClick = () => {
    setPage((currPage) => currPage - 1)
    setLogIn(false);
    setSignUp(false);
  }

  return (
    <>
    <section className={classes.wrapper}>
      <div className={classes.titlecontainer}>
        {page >= 1 ? <FontAwesomeIcon className={classes.back} icon={faChevronLeft} onClick={handleClick}/>
        : null}
        <p className={classes.title}>Login or sign up</p>
      </div>
      <div className={classes.container}>
        <div className={classes.welcome}>Welcome to subLet</div>
        <Form setPage={setPage} signUp={signUp} setSignUp={setSignUp} logIn={logIn} setLogIn={setLogIn}/>
      </div>
    </section>
    <footer>
      <BottomNav />
    </footer>
    </>
  )
}

export default SignUp

//{signUpForm()}