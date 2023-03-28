import React from "react";

import classes from "./OverviewCards.module.css";

function OverviewCards(props) {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <div className={classes.title}>
          <div>{props.number}</div>
          <div>{props.title}</div>
        </div>
        <div className={classes.desc}>{props.desc}</div>
      </div>
      <div className={classes.imagecontainer}>
        <img src={props.img} alt={props.img}/>
      </div>
    </div>
  );
}

export default OverviewCards;
