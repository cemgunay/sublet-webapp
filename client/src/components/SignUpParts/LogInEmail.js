import React from "react";

import classes from "./SignUpParts.module.css";

function LogInEmail() {


  //need to add some kind of check idk it doe


  return (
    <>
        <form className={classes.emailcontainer}>
        <input className={classes.email} type="password" placeholder="Password" />
      <button className={classes.button} type="submit">
        Log In
      </button>
        </form>
        <div>
            FORGOR PASSWORD maybe latuh
        </div>

        </>
  );
}

export default LogInEmail;
