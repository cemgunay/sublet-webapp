import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-regular-svg-icons";

import classes from "./Error.module.css";

function Error() {
  return (
    <div className={classes.error}>
      <FontAwesomeIcon className={classes.sadface} icon={faFaceSadCry} />
      <div className={classes.incorrectpassword}>Incorrect Password</div>
    </div>
  );
}

export default Error;
