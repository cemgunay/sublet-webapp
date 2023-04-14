import React, { useState } from "react";
import Carousel from "../Carousel/Carousel";

import classes from "./BigCard.module.css";

function BigCard(props) {
  return (
    <div className={classes.container} onClick={props.handleClick}>
      <div className={classes.imageContainer}>
        <img
          src={props.data.images[0].url}
          alt={props.data.images[0].filename}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.first}>
          <h3>{props.data.title}</h3>
          <p>{props.data.days_left}</p>
        </div>
        <address>{props.data.address}</address>
        <p>{props.data.dates}</p>
        <div className={classes.second}>
          <h3 className={classes.price}>{props.data.price}</h3>
          <p>{props.data.views}</p>
        </div>
      </div>
    </div>
  );
}

export default BigCard;
