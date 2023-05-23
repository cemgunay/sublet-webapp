import React from "react";
import useAuth from "../../hooks/useAuth";

import classes from "./BottomBlock.module.css";

function BottomBlock({
  data,
  handleRequest,
  handleUpdate,
  handleCounter,
  handleRescind,
  handleAccept,
  handleAcceptModal,
  handleDecline,
  status,
  status_reason,
  originalPrice,
  originalMoveInDate,
  originalMoveOutDate,
  originalViewingDate,
  goToNewRequest,
  isInTransaction,
  listingIsInTransaction
}) {
  //to check where we are viewing from
  const { role } = useAuth();

  return (
    <footer className={classes.wrapper}>
      <div className={classes.container}>
        {role === "tenant" ? (
          status === "pendingTenant" ? (
            <div>
              <button onClick={handleAccept} disabled={isInTransaction}>Accept</button>
              <button onClick={handleDecline}>Decline</button>
            </div>
          ) : status === "pendingSubTenant" ? (
            <div>
              <button onClick={handleDecline} disabled={isInTransaction}>Update Counter</button>
              <button onClick={handleRescind}>Reject Offer</button>
            </div>
          ) : status === "rejected" ? (
            status_reason === "Counter offer has been rejected" ? (
              <div>Counter offer has been rejected</div>
            ) : (
              <div>Offer has been rejected</div>
            )
          ) : (
            <div>Offer has been accepted</div>
          )
        ) : status === "pendingTenant" ? (
          <div>
            <button
              onClick={handleUpdate}
              disabled={
                (originalPrice === data.price &&
                originalMoveInDate === data.startDate &&
                originalMoveOutDate === data.endDate &&
                originalViewingDate === data.viewingDate) ||
                isInTransaction 
              }
            >
              Update Request
            </button>
            <button onClick={handleRescind}>Rescind Request</button>
          </div>
        ) : status === "pendingSubTenant" ? (
          <div>
            {originalPrice !== data.price ||
            originalMoveInDate !== data.startDate ||
            originalMoveOutDate !== data.endDate ? (
              <button onClick={handleCounter} disabled={isInTransaction}>Counter</button>
            ) : (
              <button onClick={handleAccept} disabled={isInTransaction || listingIsInTransaction}>Accept</button>
            )}
            <button onClick={handleDecline}>Decline</button>
          </div>
        ) : status === "rejected" ? (
          status_reason !== "Listing booked" &&
          status_reason !== "Listing expired" ? (
            <div>
              Offer has been rejected
              <button onClick={goToNewRequest}>Make new request</button>
            </div>
          ) : (
            <div>{status_reason}</div>
          )
        ) : status === "pendingSubTenantUpload" ? (
            <button onClick={handleAcceptModal}>Accept and Sign</button>
        ) : (
          <button onClick={handleRequest} disabled={isInTransaction}>Request</button>
        )}
      </div>
    </footer>
  );
}

export default BottomBlock;
