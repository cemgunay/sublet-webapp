import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IncrementalInputField from "../../Util/IncrementalInputField";

import { v4 as uuid } from "uuid";

import api from "../../../api/axios";
import classes from "./BottomBar.module.css";

function BottomBar({ data, setData, listing, handleChange }) {
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

    console.log(data.price)

    navigate(`request/${id}?startDate=${data.startDate}&endDate=${data.endDate}&viewingDate=${data.viewingDate}&price=${data.price}`, {
      state: { stateData: data, listing },
    });
  };

  return (
    <footer className={classes.wrapper}>
      {!listing ? null : (
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
      )}
    </footer>
  );
}

export default BottomBar;
