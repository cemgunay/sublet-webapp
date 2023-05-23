import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  //authcontext stuff
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const goToProfile = () => {
    navigate(currentUser._id);
  };

  const goToPersonalInfo = () => {
    navigate("personal-info");
  };

  const goToAccountSettings = () => {
    navigate("account-settings");
  };

  const goToListing = () => {
    navigate("/host/list");
  };

  const goToHosting = () => {
    navigate("/host");
  };

  const logOut = (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>Profile</div>
      <button onClick={goToProfile}>View Profile</button>
      <button onClick={goToPersonalInfo}>Personal Info</button>
      <button onClick={goToAccountSettings}>Account Settings</button>
      <button onClick={goToListing}>List a subLet</button>
      <button onClick={goToHosting}>Switch to Hosting</button>
      <button onClick={logOut}>Log out</button>
    </>
  );
}

export default Profile;
