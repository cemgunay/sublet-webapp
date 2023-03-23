import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Profile() {

    const navigate = useNavigate()

    //authcontext stuff
  const {user, isFetching, error, dispatch} = useContext(AuthContext);

    const goToListing = () => {
        navigate('/list')
    }

    const logOut = (e) => {
      e.preventDefault();

      try {
        dispatch({type:"LOGOUT"});
        navigate("/");
      } catch (err) {
        console.log(err);
      }

  }

    
  return (
    <>
    <div>Profile</div>
    <button onClick={goToListing}>List a subLet</button>
    <button onClick={logOut}>Log out</button>
    </>
  )
}

export default Profile