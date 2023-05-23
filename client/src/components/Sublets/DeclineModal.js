import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MonthGrid from "../Util/MonthGrid";
import IncrementalInputField from "../Util/IncrementalInputField";

import api from "../../api/axios";

import classes from "./DeclineModal.module.css";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function DeclineModal({
  request,
  setOpenModal,
  data,
  setData,
  handleChange,
  defaultMoveInDate,
  defaultMoveOutDate,
  currentUserId,
}) {
  //to not run on initial render
  const isInitialRender = useRef(true);

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
  ]);

  //to handle going back
  const goBack = () => {
    setOpenModal(false);
  };

  //to handle counter offer
  const handleCounter = (e) => {
    e.preventDefault();

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: data.tenantId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'pendingSubTenant', // use updated status here
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        toast.success("The offer has been countered");
        navigate("/host/listing/" + data.listingId);
      })
      .catch((error) => {
        toast.error("Error, can't counter offer, please try again later");
        console.error(error);
      });
  };

  //to handle decline offer
  const handleDecline = (e) => {
    e.preventDefault();

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: currentUserId,
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
      })
      .catch((error) => {
        toast.error("Error, can't reject offer, please try again later");
        console.error(error);
      });
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
              <button onClick={handleCounter} disabled={canCounter}>
                Counter
              </button>
              <button onClick={handleDecline}>Decline</button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default DeclineModal;
