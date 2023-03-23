import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";

import classes from "./BottomNav.module.css";

function BottomNav() {

  //const { user: currentUser } = useContext(AuthContext);

  //to change the elements below
  const { user: currentUser} = useContext(AuthContext);

  console.log(currentUser)

  return (
    <div className={classes.wrapper}>
      <nav className={classes.container}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          Explore
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) => (isActive ? classes.active : undefined)}
        >
          <FontAwesomeIcon icon={faUser} />
          Profile
        </NavLink>
      </nav>
    </div>
  );
}

export default BottomNav;
