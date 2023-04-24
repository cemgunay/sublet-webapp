import React from "react";

import classes from "./BottomBlock.module.css";

function BottomBlock({handleOnClick}) {
  return (
    <footer className={classes.wrapper}>
      <div className={classes.container}>
        <div onClick={handleOnClick}>Request</div>
      </div>
    </footer>
  );
}

export default BottomBlock;
