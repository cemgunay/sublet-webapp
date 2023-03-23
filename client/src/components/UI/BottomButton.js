import React from "react";

import classes from "./BottomButton.module.css";

function BottomButton(props) {
  return (
    <div className={classes.container}>
      <button className={classes.button} onClick={props.onClick}>{props.text}</button>
    </div>
  );
}

export default BottomButton;
