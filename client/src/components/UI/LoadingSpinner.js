import React from "react";
import { ClipLoader } from "react-spinners";
import classes from "./LoadingSpinner.module.css";

function LoadingSpinner() {
  const spinnerColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();

  return (
    <div className={classes.spinnerContainer}>
      <ClipLoader color={spinnerColor} loading={true} size={25} />
    </div>
  );
}

export default LoadingSpinner;


