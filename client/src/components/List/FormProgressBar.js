import React, { useState, useEffect } from 'react'

import classes from './FormProgressBar.module.css'

function FormProgressBar({ page }) {

    const widthPercentage = ((page + 1) / 9) * 100;

  return (
    <div className={classes.progressBackground}>
      <div
        className={classes.progressBar}
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  );
}

export default FormProgressBar