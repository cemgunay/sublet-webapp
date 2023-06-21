import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IncrementalInputField from "../../Util/IncrementalInputField";

import { v4 as uuid } from "uuid";

import classes from "./BottomBar.module.css";

function BottomBar({
  data,
  setData,
  listing,
  handleChange,
  requestExists,
  isBooked,
  booking,
}) {
  const getMonth = (date) => {
    const dateToChange = new Date(date);
    const options = { month: "short", year: "numeric" };
    const monthYearString = dateToChange.toLocaleDateString("en-US", options);
    return monthYearString;
  };

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      price: listing.price,
    }));
  }, [setData, listing]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      startDate: listing.moveInDate,
      endDate: listing.moveOutDate,
    }));
  }, [setData, listing]);

  const navigate = useNavigate();

  const handleOnClick = async (e) => {
    e.preventDefault();

    const id = uuid(); // generate a random UUID for URL

    navigate(
      `request/${id}/new/?startDate=${data.startDate}&endDate=${
        data.endDate
      }&viewingDate=${data.viewingDate ? data.viewingDate : null}&price=${
        data.price
      }`,
      {
        state: { data: data, listing: listing },
      }
    );
  };

  const handleOnClickCurrent = async (e) => {
    e.preventDefault();

    console.log("test 1");

    navigate(
      `request/${data._id}?startDate=${data.startDate}&endDate=${
        data.endDate
      }&viewingDate=${data.viewingDate ? data.viewingDate : null}&price=${
        data.price
      }`,
      {
        state: { data: data, listing: listing },
      }
    );
  };

  console.log(data);

  const handleOnClickSigned = async (e) => {
    e.preventDefault();

    navigate(
      `request/${data._id}?startDate=${data.startDate}&endDate=${
        data.endDate
      }&viewingDate=${data.viewingDate ? data.viewingDate : null}&price=${
        data.price
      }`,
      {
        state: { data: data, listing: listing },
      }
    );
  };

  const handleOnClickRejected = async (e) => {
    e.preventDefault();

    console.log("gang shit");

    const id = uuid(); // generate a random UUID for URL

    console.log(listing.price);

    navigate(
      `request/${id}/new?startDate=${listing.moveInDate}&endDate=${
        listing.moveOutDate
      }&viewingDate=${null}&price=${listing.price}`,
      {
        state: { listing: listing },
      }
    );
  };

  return (
    <footer className={classes.wrapper}>
      {booking ? (
        isBooked ? (
          <div className={classes.container}>
            <div onClick={handleOnClickSigned}>View Signed Contract</div>
          </div>
        ) : (
          <div className={classes.container}>
            <div>Listing is booked</div>
          </div>
        )
      ) : !listing ? null : !requestExists ? (
        <div className={classes.container}>
          <div classes={classes.left}>
            <IncrementalInputField
              data={data}
              setData={setData}
              type="price"
              from="BottomBar"
              handleChange={handleChange}
            />
            <div>
              {getMonth(data.startDate)} -{getMonth(data.endDate)}
            </div>
          </div>
          <div onClick={handleOnClick}>Request</div>
        </div>
      ) : (
        <div className={classes.container}>
          <div>
            {data.status === "pendingTenant" ? (
              <div onClick={handleOnClickCurrent}>View Current Offer</div>
            ) : data.status === "rejected" ? (
              data.status_reason !== "Listing booked" &&
              data.status_reason !== "Listing expired" &&
              data.status_reason ? (
                <div>
                  <div onClick={handleOnClickCurrent}>View Rejected Offer</div>
                  <button onClick={handleOnClickRejected}>
                    Make new request
                  </button>
                </div>
              ) : (
                <div onClick={handleOnClickCurrent}>View Rejected Offer</div>
              )
            ) : data.status === "pendingSubTenantUpload" ||
              data.status === "pendingTenantUpload" ||
              data.status === "pendingFinalAccept" ? (
              <div onClick={handleOnClickCurrent}>View Final Offer</div>
            ) : (
              <div onClick={handleOnClickCurrent}>View Counter Offer</div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}

export default BottomBar;
