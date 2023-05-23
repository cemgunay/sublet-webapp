import React, { useEffect, useRef, useState, useMemo } from "react";
import BottomNav from "../../../components/BottomNav/BottomNav";

import classes from "./SubletsSubtenant.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function SubletsSubtenant() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation(); // Get the current location

  const menuRef = useRef(); // Create a reference to the menu

  const navigate = useNavigate();

  const navigationPages = useMemo(() => ["active", "past", "confirmed"], []);

  useEffect(() => {
    if (!navigationPages.some((value) => location.pathname.includes(value))) {
      navigate("active");
    }
  }, [navigate, location.pathname, navigationPages]);

  useEffect(() => {
    function handleClickOutside(event) {
      // If the menu is open and the click was outside the menu, close the menu
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]); // Recreate the event listener when 'menuOpen' changes

  return (
    <div>
      <section className={classes.container}>
        <h1> My subLets</h1>
        <FontAwesomeIcon icon={faBars} onClick={() => setMenuOpen(!menuOpen)} />
        <div
          ref={menuRef}
          className={`${classes.hamburgerMenu} ${
            menuOpen ? classes.hamburgerMenuOpen : ""
          }`}
        >
          <div className={classes.menuList}>
            <div className={classes.menuItem}>
              <Link
                to="active"
                onClick={() => setMenuOpen(false)}
                className={
                  location.pathname.includes("active") ? classes.activeLink : ""
                }
              >
                Active
              </Link>
            </div>
            <div className={classes.menuItem}>
              <Link
                to="past"
                onClick={() => setMenuOpen(false)}
                className={
                  location.pathname.includes("past") ? classes.activeLink : ""
                }
              >
                Past
              </Link>
            </div>
            <div className={classes.menuItem}>
              <Link
                to="confirmed"
                onClick={() => setMenuOpen(false)}
                className={
                  location.pathname.includes("confirmed")
                    ? classes.activeLink
                    : ""
                }
              >
                Confirmed
              </Link>
            </div>
          </div>
        </div>
        <Outlet />
      </section>
      <footer className={classes.footer}>
        <BottomNav />
      </footer>
    </div>
  );
}

export default SubletsSubtenant;
