import {
  faCircleChevronLeft,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MonthGrid from "../Util/MonthGrid";
import IncrementalInputField from "../Util/IncrementalInputField";

import api from "../../api/axios";

import classes from "./DeclineModal.module.css";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

import withLoadingSpinner from "../Util/LoadingSpinner";
import { Box, Button, Modal } from "@mui/material";

function DeclineModal({
  setLoading,
  request,
  setOpenModal,
  data,
  setData,
  handleChange,
  defaultMoveInDate,
  defaultMoveOutDate,
  currentUser,
}) {
  //to not run on initial render
  const isInitialRender = useRef(true);

  //to handle reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);

  const navigate = useNavigate();

  //for changing the subLet dates
  const handleDataChange = useCallback(
    ({ startDate, endDate }) => {
      setData((prevData) => ({
        ...prevData,
        startDate: startDate,
        endDate: endDate,
      }));
    },
    [setData]
  );

  //useEffect for render
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      console.log(data.price);
      console.log(request.price);
    }
  }, [
    data.price,
    data.startDate,
    data.endDate,
    defaultMoveInDate,
    defaultMoveOutDate,
    request.price,
    setData,
  ]);

  const [canCounter, setCanCounter] = useState(true);
  const isInTransaction = currentUser.currentTenantTransaction;
  //useEffect to handle if counter button is disabled or not
  useEffect(() => {
    if (
      data.price === request.price &&
      data.startDate === request.startDate &&
      data.endDate === request.endDate
    ) {
      setCanCounter(true);
    } else {
      setCanCounter(false);
    }
  }, [
    data.price,
    data.startDate,
    data.endDate,
    request.price,
    request.startDate,
    request.endDate,
    currentUser.currentTenantTransaction,
  ]);

  //to handle going back
  const goBack = () => {
    setOpenModal(false);
  };

  //to handle counter offer
  const handleCounter = (e) => {
    e.preventDefault();

    setLoading(true);

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: data.tenantId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "pendingSubTenant",
      tenantDocuments: [],
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        toast.success("The offer has been countered");
        navigate("/host/listing/" + data.listingId);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error, can't counter offer, please try again later");
        console.error(error);
        setLoading(false);
      });
  };

  //to handle decline offer
  const handleDecline = (e) => {

    setLoading(true);

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: currentUser._id,
      status: "rejected",
      status_reason: "Offer has been rejected",
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        setData((prevData) => ({
          ...prevData,
          status: "rejected",
          status_reason: "Offer has been rejected",
        }));
        toast.success("The offer has been rejected");
        navigate("/host/listing/" + data.listingId);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error, can't reject offer, please try again later");
        console.error(error);
        setLoading(false);
      });
  };

  //opens reject modal
  const handleReject = (e) => {
    e.preventDefault();
    setShowRejectModal(true);
  };

  //confirm the reject operation in the modal
  const handleRejectModalConfirm = () => {
    // Perform the reject operation here, then close the modal
    handleDecline();
  };

  // Just close the reject modal
  const handleRejectModalCancel = () => {
    setShowRejectModal(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.headercontainer}>
        <div className={classes.header}>
          <div className={classes.back} onClick={goBack}>
            <FontAwesomeIcon icon={faCircleChevronLeft} />
          </div>
          <div className={classes.previewtitle}>
            {data.status === "pendingSubTenant" ? "Update" : "Decline"}
          </div>
        </div>
      </div>
      {!data ? null : (
        <div className={classes.contentcontainer}>
          <div className={classes.inputcontainer}>
            <div>Counter Price</div>
            <IncrementalInputField
              data={data}
              setData={setData}
              type="price"
              from="DeclineModal"
              handleOnChange={handleChange}
            />
          </div>
          <div className={classes.inputcontainer}>
            <div>Counter Dates</div>
            <MonthGrid
              defaultMoveInDate={defaultMoveInDate}
              defaultMoveOutDate={defaultMoveOutDate}
              moveInDate={data.startDate}
              moveOutDate={data.endDate}
              shorterStays={true}
              onDataChange={handleDataChange}
            />
          </div>
        </div>
      )}
      <footer className={classes.wrapper}>
        <div className={classes.bottomcontainer}>
          {data.status === "pendingSubTenant" ? (
            <button onClick={handleCounter}>Update Counter</button>
          ) : (
            <div>
              <div
                className={`${classes.buttonContainer} ${
                  canCounter ? classes.disabled : ""
                }`}
                data-tooltip-id={
                  canCounter || isInTransaction ? "info-tooltip" : ""
                }
                data-tooltip-content={
                  canCounter || isInTransaction
                    ? "You are currently in another transaction"
                    : ""
                }
              >
                {(canCounter || isInTransaction) && (
                  <div className={classes.infoIcon}>
                    <Tooltip id="info-tooltip" className={classes.tooltip} />
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                )}
                <button
                  className={classes.button}
                  onClick={handleCounter}
                  disabled={canCounter || isInTransaction}
                >
                  Counter
                </button>
              </div>
              <button onClick={handleReject}>Decline</button>
            </div>
          )}
        </div>
      </footer>
      <Modal open={showRejectModal} onClose={handleRejectModalCancel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Are you sure you want to reject?</h2>
          <Button onClick={handleRejectModalConfirm}>Yes</Button>
          <Button onClick={handleRejectModalCancel}>No</Button>
        </Box>
      </Modal>
    </div>
  );
}

const DeclineModalWithSpinner = withLoadingSpinner(DeclineModal);

export default DeclineModalWithSpinner;
