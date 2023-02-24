import React from "react";

import classes from "./SignUpParts.module.css";

function LogInEmail() {


  //need to add some kind of check idk it doe


  return (
    <div className={classes.emailform}>
        <form>
        <input className={classes.email} type="password" placeholder="Password" />
      <button className={classes.button} type="submit">
        Log In
      </button>
        </form>
        <div>
            FORGOR PASSWORD maybe latuh
        </div>
    </div>
  );
}

export default LogInEmail;
