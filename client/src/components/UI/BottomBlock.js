import React from "react";

import classes from "./BottomBlock.module.css";

function BottomBlock({
  data,
  handleRequest,
  handleUpdate,
  handleCounter,
  handleAccept,
  handleDecline,
  from,
  status,
  originalPrice,
  originalMoveInDate,
  originalMoveOutDate
}) {

  return (
    <footer className={classes.wrapper}>
      <div className={classes.container}>
        {from === "RequestDetails" ? (
          <div>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDecline}>Decline</button>
          </div>
        ) : status === "pendingTenant" ? (
          <div>
            <button onClick={handleUpdate} disabled={originalPrice === data.price && originalMoveInDate === data.startDate && originalMoveOutDate === data.endDate}>Update Request</button>
            <button onClick={handleRequest}>Rescind Request</button>
          </div>
        ) : status === "pendingSubTenant" ? (
          <div>
            {originalPrice !== data.price || originalMoveInDate!== data.startDate || originalMoveOutDate !== data.endDate ? 
            <button onClick={handleUpdate}>Counter</button> : 
            <button onClick={handleAccept}>Accept</button>
          }
            <button onClick={handleDecline}>Decline</button>
          </div>
        ) : (
          <button onClick={handleRequest}>Request</button>
        )}
      </div>
    </footer>
  );
}

export default BottomBlock;
