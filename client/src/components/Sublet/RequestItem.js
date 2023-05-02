import React from "react";
import { Link } from "react-router-dom";

import classes from "./RequestItem.module.css";

function RequestItem({ listing, request, name, price }) {
  return (
    <Link
      to={"request/" + request._id}
      state={{ listing, request }}
      className={classes.requestItem}
    >
      {request.status === 'pendingSubTenant' ? <div>countered</div>: null}
      {name} - ${price}
    </Link>
  );
}

export default RequestItem;
