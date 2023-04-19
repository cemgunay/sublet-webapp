import React from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed } from "@fortawesome/free-solid-svg-icons";

import classes from "./ScrollCard.module.css";

function ScrollCard(props) {
  const visibility = React.useContext(VisibilityContext);
  return (
    <div
      className={classes.container}
      onClick={() => props.onClick(visibility)}
      tabIndex={0}
    >
      <div className={classes.card}>
        <FontAwesomeIcon icon={faBed} size="2x" />
        <div className={classes.text}>
          <div className={classes.title}>{props.title}</div>
          {props.beds.map((bed, index) => (
            <div key={index}>1 {bed} Bed</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScrollCard;

//this is to show if its visible or not
/*
<div>visible: {JSON.stringify(!!visibility.isItemVisible(props.itemId))}</div>
*/

//this is to set if its selected or not
/*
<div
      onClick={() => props.onClick(visibility)}
      style={{
        width: "160px",
      }}
      tabIndex={0}
    >
  </div>
  */

//then this is used to show if its selected or not
//<div>selected: {JSON.stringify(!!props.selected)}</div>
