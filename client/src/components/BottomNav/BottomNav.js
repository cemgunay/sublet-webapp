import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faInbox,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./BottomNav.module.css";

function CustomNavLink({ to, children, additionalPaths, ...rest }) {
  let location = useLocation();
  let isActive =
    location.pathname === to ||
    (additionalPaths &&
      additionalPaths.some((path) => location.pathname.startsWith(path)));

  return (
    <NavLink
      to={to}
      className={isActive ? classes.active : undefined}
      {...rest}
    >
      {children}
    </NavLink>
  );
}

function BottomNav() {
  const { user: currentUser, role } = useContext(AuthContext);
  console.log(currentUser);
  console.log(role);

  return (
    <div className={classes.wrapper}>
      <nav className={classes.container}>
        {currentUser ? (
          role === "subtenant" ? (
            <>
              <CustomNavLink to="/">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Explore
              </CustomNavLink>
              <CustomNavLink
                to="/sublets"
                additionalPaths={[
                  "/sublets/active",
                  "/sublets/past",
                  "/sublets/confirmed",
                ]}
              >
                <FontAwesomeIcon icon={faHouse} />
                subLets
              </CustomNavLink>
              <CustomNavLink to="/inbox">
                <FontAwesomeIcon icon={faInbox} />
                Inbox
              </CustomNavLink>
              <CustomNavLink to="/profile">
                <FontAwesomeIcon icon={faUser} />
                Profile
              </CustomNavLink>
            </>
          ) : (
            <>
              <CustomNavLink
                to="/host"
                additionalPaths={[
                  "/host/active",
                  "/host/past",
                  "/host/confirmed",
                ]}
              >
                <FontAwesomeIcon icon={faHouse} />
                subLets
              </CustomNavLink>
              <CustomNavLink to="/host/inbox">
                <FontAwesomeIcon icon={faInbox} />
                Inbox
              </CustomNavLink>
              <CustomNavLink
                to="/host/menu"
                additionalPaths={[
                  "/host/list",
                  "/host/listing/manage-your-listing",
                ]}
              >
                <FontAwesomeIcon icon={faBars} />
                Menu
              </CustomNavLink>
            </>
          )
        ) : (
          <>
            <CustomNavLink to="/">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Explore
            </CustomNavLink>
            <CustomNavLink to="/signup">
              <FontAwesomeIcon icon={faUser} />
              Profile
            </CustomNavLink>
          </>
        )}
      </nav>
    </div>
  );
}

export default BottomNav;
