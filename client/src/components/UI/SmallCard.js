import React from "react";

import classes from "./SmallCard.module.css";

function SmallCard(props) {
  return <div className={classes.card}>{props.children}</div>;
}

export default SmallCard;
