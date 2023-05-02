import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef} from "react";
import MonthGrid from "../Util/MonthGrid";
import IncrementalInputField from "../Util/IncrementalInputField";

import api from "../../api/axios";

import classes from "./DeclineModal.module.css";
import { useNavigate } from "react-router-dom";

function DeclineModal({
  request,
  setOpenModal,
  data,
  setData,
  handleChange,
  defaultMoveInDate,
  defaultMoveOutDate,
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
      console.log(data.price)
      console.log(request.price)
      if (data.price === request.price) {
        if (
          data.startDate === defaultMoveInDate &&
          data.endDate === defaultMoveOutDate
        ) {
          setData((prevData) => ({
            ...prevData,
            status: "pendingTenant",
          }));
        } else {
          setData((prevData) => ({
            ...prevData,
            status: "pendingSubTenant",
          }));
        }
      } else {
        setData((prevData) => ({
          ...prevData,
          status: "pendingSubTenant",
        }));
      }
    }
  }, [data.price, data.startDate, data.endDate, defaultMoveInDate, defaultMoveOutDate, request.price, setData]);

  console.log(data)

  //to handle going back
  const goBack = () => {
    setOpenModal(false);
  };

  //to handle counter offer
  const handleCounter = (e) => {
    e.preventDefault();

    const updateRequest = {
      subTenantId: data.subTenantId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status
    };
    api
        .put("/requests/update/" + data._id, updateRequest)
        .then((response) => {
          console.log(response.data);
          //navigate("/");
        })
        .catch((error) => console.error(error));
  };

  //to handle decline offer
  const handleDecline = () => {};

  return (
    <div className={classes.container}>
      <div className={classes.headercontainer}>
        <div className={classes.header}>
          <div className={classes.back} onClick={goBack}>
            <FontAwesomeIcon icon={faCircleChevronLeft} />
          </div>
          <div className={classes.previewtitle}>Decline</div>
        </div>
      </div>
      {!data ? null : (
        <div>
          <div>
            bad price
            <IncrementalInputField
              data={data}
              setData={setData}
              type="price"
              from="DeclineModal"
              handleOnChange={handleChange}
            />
          </div>
          <div>
            bad month
            <MonthGrid
              defaultMoveInDate={defaultMoveInDate}
              defaultMoveOutDate={defaultMoveOutDate}
              moveInDate={data.startDate}
              moveOutDate={data.endDate}
              shorterStays={true}
              onDataChange={handleDataChange}
            />
          </div>
          <footer className={classes.wrapper}>
        <div className={classes.bottomcontainer}>
          <button
            onClick={handleCounter}
            disabled={data.status !== "pendingSubTenant"}
          >
            Counter
          </button>
          <button onClick={handleDecline}>Decline</button>
        </div>
      </footer>
        </div>
      )}

      
    </div>
  );
}

export default DeclineModal;
