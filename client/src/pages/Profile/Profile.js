import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import classes from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../../components/BottomNav/BottomNav";

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
      <div className={classes.container}>
        <div className={classes.showprofilecontainer} onClick={goToProfile}>
          <div className={classes.imageandcontentcontainer}>
            <div className={classes.profileimage}>
              <img
                src={
                  currentUser.profilePicture
                    ? currentUser.profilePicture
                    : "/images/logo192.png" //add default image here if no profile image
                }
                alt="profilepic"
              />
            </div>
            <div className={classes.showprofilecontentcontainer}>
              <div className={classes.name}>{currentUser.firstName}</div>
              <div className={classes.showprofilebutton}>Show profile</div>
            </div>
          </div>
          <div className={classes.showprofilechevron}>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
        <div className={classes.contentcontainer}>
          <div className={classes.contentitem}>
            <h2 className={classes.contenttitle}>Account</h2>
            <div className={classes.linkscontainer}>
              <div onClick={goToPersonalInfo}>Personal Info</div>
              <div onClick={goToAccountSettings}>Account Settings</div>
            </div>
          </div>
          <div className={classes.contentitem}>
            <h2 className={classes.contenttitle}>Tenant</h2>
            <div className={classes.linkscontainer}>
              <div onClick={goToListing}>List a subLet</div>
              <div onClick={goToHosting}>Switch to Hosting</div>
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

export default Profile;
