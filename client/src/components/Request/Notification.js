import React from "react";
import Countdown from "../Util/Countdown";

import classes from "./Notification.module.css";

function Notification({ request }) {
  return (
    <div>
      {request.status === "pendingSubTenantUpload" ? (
        <div className={classes.contentcontainer}>You need to upload</div>
      ) : request.status === "pendingTenantUpload" ? (
        <div className={classes.contentcontainer}>
          Waiting for tenant to upload
        </div>
      ) : request.status === "pendingFinalAccept" ? (
        request.tenantFinalAccept ? (
          <div className={classes.contentcontainer}>You need to verify and sign</div>
        ) : request.subtenantFinalAccept ? (
          <div className={classes.contentcontainer}>Waiting for tenant to verify and sign</div>
        ) : null
      ) : null}
    </div>
  );
}

export default Notification;
