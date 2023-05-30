import React from "react";
import useAuth from "../../hooks/useAuth";

import { Tooltip } from "react-tooltip";

import classes from "./BottomBlock.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function BottomBlock({
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
  isInTransaction,
  listingIsInTransaction,
}) {
  //to check where we are viewing from
  const { role } = useAuth();

  console.log(status);

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
            <div>Offer has been accepted</div>
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
          <div>Offer has been accepted</div>
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
