import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


function Menu() {

    const navigate = useNavigate()

    //authcontext stuff
  const {user: currentUser, dispatch} = useContext(AuthContext);

    const goToListing = () => {
        navigate('/host/list')
    }

    const goToCreateListing = () => {
      navigate('/host/list/info')
  }

    const goToSubtenant = () => {
      navigate('/')
  }

  const goToProfile = () => {
    navigate('/profile/' + currentUser._id)
}

const goToAccountSettings = () => {
  navigate('/profile/account-settings')
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
    <button onClick={goToListing}>See My Listings</button>
    <button onClick={goToCreateListing}>Create a new Listing</button>
    <button onClick={goToSubtenant}>Switch to subtenant</button>
    <button onClick={goToProfile}>View Profile</button>
    <button onClick={goToAccountSettings}>Account Settings</button>
    <button onClick={logOut}>Log out</button>
    </>
  )
}

export default Menu