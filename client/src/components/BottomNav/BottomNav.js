import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import classes from "./BottomNav.module.css";

function BottomNav() {
  //const { user: currentUser } = useContext(AuthContext);

  //to change the elements below
  const { user: currentUser, role } = useContext(AuthContext);

  console.log(currentUser);
  console.log(role);

  return (
    <div className={classes.wrapper}>
      <nav className={classes.container}>
        {currentUser ? (
          role === "subtenant" ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Explore
              </NavLink>
              <NavLink
                to="/sublets"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <FontAwesomeIcon icon={faHouse} />
                subLets
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <FontAwesomeIcon icon={faUser} />
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/host"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <FontAwesomeIcon icon={faHouse} />
                subLets
              </NavLink>
              <NavLink
                to="/host/menu"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <FontAwesomeIcon icon={faBars} />
                Menu
              </NavLink>
            </>
          )
        ) : (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Explore
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              <FontAwesomeIcon icon={faUser} />
              Profile
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}

export default BottomNav;
