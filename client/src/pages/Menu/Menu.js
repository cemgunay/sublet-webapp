import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import classes from "./Menu.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";

function Menu() {
  const navigate = useNavigate();

  //authcontext stuff
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const goToListing = () => {
    navigate("/host/list");
  };

  const goToCreateListing = () => {
    navigate("/host/list/overview");
  };

  const goToSubtenant = () => {
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile/" + currentUser._id);
  };

  const goToAccountSettings = () => {
    navigate("/profile/account-settings");
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
      <div className={classes.container}>
        <h1>Menu</h1>
        <div className={classes.contentcontainer}>
          <div className={classes.contentitem}>
            <h2 className={classes.contenttitle}>Hosting</h2>
            <div className={classes.linkscontainer}>
              <div onClick={goToListing}>See my listings</div>
              <div onClick={goToCreateListing}>Create a new listing</div>
            </div>
          </div>
          <div className={classes.contentitem}>
            <h2 className={classes.contenttitle}>Account</h2>
            <div className={classes.linkscontainer}>
              <div onClick={goToProfile}>Your profile</div>
              <div onClick={goToAccountSettings}>Settings</div>
              <div onClick={goToSubtenant}>Switch to subtenant</div>
            </div>
          </div>
        </div>
        <div onClick={logOut}>Log out</div>
      </div>
      <footer className={classes.footer}>
        <BottomNav />
      </footer>
    </>
  );
}

export default Menu;
