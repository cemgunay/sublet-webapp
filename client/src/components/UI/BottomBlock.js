import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import { Tooltip } from "react-tooltip";

import classes from "./BottomBlock.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function BottomBlock({
  listing,
  data,
  handleRequest,
  handleUpdate,
  handleCounter,
  handleRescind,
  handleReject,
  handleAccept,
  handleDecline,
  status,
  status_reason,
  originalPrice,
  originalMoveInDate,
  originalMoveOutDate,
  originalViewingDate,
  goToNewRequest,
  mostRecentRequest,
  fetchRecentRequest,
  goToRecentRequest,
  isInTransaction,
  listingIsInTransaction,
}) {
  //to check where we are viewing from
  const { role } = useAuth();

  console.log(status);

  function datesOverlap(startDate1, endDate1, startDate2, endDate2) {
    return startDate1 <= endDate2 && startDate2 <= endDate1;
  }

  const [overlap, setOverlap] = useState(false);

  if (listing && listing.bookedDates) {
    console.log(listing);
    for (let dateRange of listing.bookedDates) {
      if (
        datesOverlap(
          data.startDate,
          data.endDate,
          dateRange.startDate,
          dateRange.endDate
        )
      ) {
        // The old request's dates overlap with a booked date range.
        setOverlap(true);
        break;
      }
    }
  }

  useEffect(() => {
    if (status === "rejected" && role === "subtenant") {
      // Use a function to fetch the most recent request.
      fetchRecentRequest();
    }
  }, [status]);

  return (
    <footer className={classes.wrapper}>
      <div className={classes.container}>
        {role === "tenant" ? (
          status === "pendingTenant" ? (
            <div>
              <div
                className={`${classes.buttonContainer} ${
                  isInTransaction ? classes.disabled : ""
                }`}
                data-tooltip-id="info-tooltip"
                data-tooltip-content="You are currently in another transaction"
              >
                {isInTransaction && (
                  <div className={classes.infoIcon}>
                    <Tooltip id="info-tooltip" className={classes.tooltip} />
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                )}
                <button
                  onClick={handleAccept}
                  disabled={isInTransaction}
                  className={classes.button}
                >
                  Accept
                </button>
              </div>
              <button onClick={handleDecline}>Decline</button>
            </div>
          ) : status === "pendingSubTenant" ? (
            <div>
              <div
                className={`${classes.buttonContainer} ${
                  isInTransaction ? classes.disabled : ""
                }`}
                data-tooltip-id="info-tooltip"
                data-tooltip-content="You are currently in another transaction"
              >
                {isInTransaction && (
                  <div className={classes.infoIcon}>
                    <Tooltip id="info-tooltip" className={classes.tooltip} />
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                )}
                <button
                  onClick={handleDecline}
                  disabled={isInTransaction}
                  className={classes.button}
                >
                  Update Counter
                </button>
              </div>
              <button onClick={handleReject}>Reject Offer</button>
            </div>
          ) : status === "rejected" ? (
            status_reason === "Counter offer has been rejected" ? (
              <div>Counter offer has been rejected</div>
            ) : status_reason === "Listing removed" ? (
              <div>Listing removed</div>
            ) : (
              <div>Offer has been rejected</div>
            )
          ) : status === "pendingSubTenantUpload" ? (
            <button onClick={handleAccept} className={classes.button}>
              Waiting for subtenant to upload
            </button>
          ) : status === "pendingTenantUpload" ? (
            <button onClick={handleAccept} className={classes.button}>
              Waiting for you to upload
            </button>
          ) : status === "pendingFinalAccept" ? (
            <button onClick={handleAccept} className={classes.button}>
              {data.tenantFinalAccept
                ? "Waiting for subtenant to verify and sign"
                : "Verify and sign"}
            </button>
          ) : (
            <div onClick={handleAccept}>View Signed Documents</div>
          )
        ) : status === "pendingTenant" ? (
          <div>
            <div
              className={`${classes.buttonContainer} ${
                isInTransaction ? classes.disabled : ""
              }`}
              data-tooltip-id="info-tooltip"
              data-tooltip-content="You are currently in another transaction"
            >
              {isInTransaction && (
                <div className={classes.infoIcon}>
                  <Tooltip id="info-tooltip" className={classes.tooltip} />
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
              )}
              <button
                className={classes.button}
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
            </div>

            <button onClick={handleRescind}>Rescind Request</button>
          </div>
        ) : status === "pendingSubTenant" ? (
          <div>
            {originalPrice !== data.price ||
            originalMoveInDate !== data.startDate ||
            originalMoveOutDate !== data.endDate ? (
              <div
                className={`${classes.buttonContainer} ${
                  isInTransaction ? classes.disabled : ""
                }`}
                data-tooltip-id="info-tooltip"
                data-tooltip-content="You are currently in another transaction"
              >
                {isInTransaction && (
                  <div className={classes.infoIcon}>
                    <Tooltip id="info-tooltip" className={classes.tooltip} />
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                )}
                <button
                  onClick={handleCounter}
                  disabled={isInTransaction}
                  className={classes.button}
                >
                  Counter
                </button>
              </div>
            ) : (
              <div
                className={`${classes.buttonContainer} ${
                  isInTransaction ? classes.disabled : ""
                }`}
                data-tooltip-id="info-tooltip"
                data-tooltip-content="You are currently in another transaction"
              >
                {isInTransaction && (
                  <div className={classes.infoIcon}>
                    <Tooltip id="info-tooltip" className={classes.tooltip} />
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                )}
                <button
                  className={classes.button}
                  onClick={handleAccept}
                  disabled={isInTransaction || listingIsInTransaction}
                >
                  Accept
                </button>
              </div>
            )}
            <button onClick={handleDecline}>Decline</button>
          </div>
        ) : status === "rejected" ? (
          mostRecentRequest ? (
            <div>
              You have a more recent request
              <button onClick={goToRecentRequest}>View</button>
            </div>
          ) : overlap ? (
            <div> The listing is booked for these dates. </div>
          ) : status_reason !== "Listing booked" &&
            status_reason !== "Listing expired" &&
            status_reason !== "Listing removed" ? (
            <div>
              Offer has been rejected
              <button onClick={goToNewRequest}>Make new request</button>
            </div>
          ) : (
            <div>{status_reason}</div>
          )
        ) : status === "pendingSubTenantUpload" ? (
          <button onClick={handleAccept}>Waiting for you to upload</button>
        ) : status === "pendingTenantUpload" ? (
          <button onClick={handleAccept}>Waiting for tenant to upload</button>
        ) : status === "pendingFinalAccept" ? (
          <button onClick={handleAccept}>
            {data.subtenantFinalAccept
              ? "Waiting for tenant to verify and sign"
              : "Verify and sign"}
          </button>
        ) : status === "confirmed" ? (
          <div onClick={handleAccept}>View Signed Documents</div>
        ) : (
          <div
            className={`${classes.buttonContainer} ${
              isInTransaction ? classes.disabled : ""
            }`}
            data-tooltip-id="info-tooltip"
            data-tooltip-content="You are currently in another transaction"
          >
            {isInTransaction && (
              <div className={classes.infoIcon}>
                <Tooltip id="info-tooltip" className={classes.tooltip} />
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
            )}
            <button
              onClick={handleRequest}
              disabled={isInTransaction}
              className={classes.button}
            >
              Request
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}

export default BottomBlock;
