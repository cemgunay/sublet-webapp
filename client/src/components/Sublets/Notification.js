import React from "react";

import classes from "./Notification.module.css";

function Notification({ requests }) {
  return (
    <div>
      {requests.filter((request) => request.status === "pendingSubTenantUpload")
        .length > 0 ? (
        <div className={classes.contentcontainer}>
          Waiting for subtenant to upload
        </div>
      ) : requests.filter((request) => request.status === "pendingTenantUpload")
          .length > 0 ? (
        <div className={classes.contentcontainer}>You need to upload</div>
      ) : requests.filter(
          (request) =>
            request.status === "pendingFinalAccept" && request.tenantFinalAccept
        ).length > 0 ? (
        <div className={classes.contentcontainer}>Waiting for subtenant to verify and sign</div>
      ) : (
        requests.filter(
          (request) =>
            request.status === "pendingFinalAccept" &&
            request.subtenantFinalAccept
        ).length > 0 && <div className={classes.contentcontainer}>You need to verify and sign</div>
      )}
    </div>
  );
}

export default Notification;
