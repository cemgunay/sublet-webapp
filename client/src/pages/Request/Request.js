import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import {
  useNavigate,
  useLocation,
  useParams
} from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import MonthGrid from "../../components/Util/MonthGrid";
import { TextField } from "@mui/material";
import IncrementalInputField from "../../components/Util/IncrementalInputField";
import useRequestFormContext from "../../hooks/useRequestFormContext";

import classes from "./Request.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import BottomBlock from "../../components/UI/BottomBlock";

function Request() {
  const { listingId, requestId } = useParams();

  const location = useLocation();
  const { state } = location;

  const [listing, setListing] = useState(null);

  const { data, setData, handleChange } = useRequestFormContext();

  const navigate = useNavigate();

  console.log(data);

  //On refresh, get listing and tenant id from DB
  useEffect(() => {
    api.get("/listings/" + listingId).then((response) => {
      console.log(response.data);
      setListing(response.data);
      setData((prevData) => ({
        ...prevData,
        listingId: listingId,
        tenantId: response.data.userId,
        viewingDate: null,
      }));
    });
  }, [listingId, setData]);

  //when startDate and endDate change update URL
  useEffect(() => {
    // Replace the current URL entry without adding a new one to the history
    navigate(
      `?startDate=${data.startDate}&endDate=${data.endDate}&viewingDate=${data.viewingDate}&price=${data.price}`,
      { replace: true }
    );
  }, [
    data.startDate,
    data.endDate,
    data.price,
    data.viewingDate,
    navigate,
    requestId,
  ]);

  //if there is no state, take listing from parameters
  useEffect(() => {
    if (!state) {
      api.get("/listings/" + listingId).then((response) => {
        setListing(response.data);
      });
    } else {
      setListing(state.listing);
    }
  }, [listingId, state]);

  //handle changing the vieweing date
  const handleOnChangeViewing = (date) => {
    //const formattedDate = date.toISOString(); //can do this if we want formatted viewing dates

    setData((prevData) => ({
      ...prevData,
      viewingDate: date,
    }));
  };

  const shouldDisableDate = (date) => {
    if (!listing.viewingDates || !date) return true;
    const isoDates = listing.viewingDates.map((d) =>
      dayjs(d).format("YYYY-MM-DD")
    );
    return !isoDates.includes(date.format("YYYY-MM-DD"));
  };

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

  //to get the month name from ISO
  const getMonth = (date) => {
    const dateToChange = new Date(date);
    const options = { month: "short", year: "numeric" };
    const monthYearString = dateToChange.toLocaleDateString("en-US", options);
    return monthYearString;
  };

  //to get the difference between in months between two ISO
  const getMonthDiff = (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const diffInMs = Math.abs(date2 - date1); // absolute difference in milliseconds
    const avgMsInMonth = 1000 * 60 * 60 * 24 * 30.44; // average milliseconds in a month
    const diffInMonths = Math.round(diffInMs / avgMsInMonth); // round to nearest integer
    return diffInMonths;
  };

  //for the totals to be displayed
  const subTotal = parseFloat((
    data.price * getMonthDiff(data.startDate, data.endDate)
  ).toFixed(2));
  const atic = parseFloat((
    ((data.price * getMonthDiff(data.startDate, data.endDate)) / 2) *
    0.04
  ).toFixed(2));

  const total = (subTotal + atic).toFixed(2)
  const due = subTotal / 2 + atic;

  const goBack = () => {
    navigate(-1);
  };

  const handleOnClick = async (e) => {
    e.preventDefault();

    const newRequest = {
      tenantId: data.tenantId,
      subTenantId: data.subTenantId,
      listingId: data.listingId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    api
      .post("/requests/" + listing._id, newRequest)
      .then((response) => {
        console.log(response.data);
        navigate('/')
      })
      .catch((error) => console.error(error));
  };

  console.log(data)

  return (
    <div>
      <div className={classes.headercontainer}>
        <div className={classes.header}>
          <div className={classes.back} onClick={goBack}>
            <FontAwesomeIcon icon={faCircleChevronLeft} />
          </div>
          <div className={classes.previewtitle}>Request to subLet</div>
        </div>
        <div className={classes.listingpreviewcontainer}>
          <div className={classes.protectiontext}>
            Your request is protected by our escrow service
          </div>
          <div className={classes.listingpreviewcontent}>
            <div className={classes.previewimage}>
              <img
                src={listing?.images[0].url ? listing.images[0].url : null}
                alt={
                  listing?.images[0].filename
                    ? listing.images[0].filename
                    : null
                }
              />
            </div>
            <div className={classes.listingpreviewtextcontainer}>
              <div>331 Phillip St, Waterloo, ON</div>
              <div>2 Bedroom in 3 Bedroom Suite</div>
              <div>Jan - April 2023</div>
            </div>
          </div>
        </div>
      </div>
      {!data._id !== "" && !listing ? (
        <div>loadingg</div>
      ) : (
        <div className={classes.contentcontainer}>
          <MonthGrid
            moveInDate={data.startDate}
            moveOutDate={data.endDate}
            shorterStays={listing.shorterStays}
            onDataChange={handleDataChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"Select Viewing Date"}
              value={data.viewingDate}
              onChange={handleOnChangeViewing}
              components={{
                textField: TextField,
              }}
              shouldDisableDate={shouldDisableDate}
              disableHighlightToday
              initialFocusedDate={
                listing.viewingDates.length > 0
                  ? dayjs(listing.viewingDates[0])
                  : null
              }
            />
          </LocalizationProvider>
          <div>
            <div>Price Offer</div>
            <IncrementalInputField
              data={data}
              setData={setData}
              type="price"
              from="Request"
              handleOnChange={handleChange}
            />
          </div>
          <div className={classes.requestdetailscontainer}>
            Your Request
            <div className={classes.details}>
              <div>subLet months</div>
              {getMonth(data.startDate)} -{getMonth(data.endDate)}
              <div>Move in - Move out</div>
              {new Date(data.startDate)?.toLocaleDateString()} - {new Date(data.endDate)?.toLocaleDateString()}
            </div>
            <div className={classes.details}>
              <div>viewing date</div>
              {data.viewingDate?.toISOString() ?? 'No viewing date selected'}
            </div>
            <div className={classes.details}>
              <div>price details</div>
              <div className={classes.detailsrow}>
                <div>
                  ${data.price} CAD x{" "}
                  {getMonthDiff(data.startDate, data.endDate)} months
                </div>
                <div>${subTotal.toString()} CAD</div>
              </div>
              <div className={classes.detailsrow}>
                <div>ATIC</div>
                <div>${atic.toString()} CAD</div>
              </div>
            </div>
            <div className={classes.details}>
              <div className={classes.detailsrow}>
                <div>Total</div>
                <div>${total.toString()} CAD</div>
              </div>
            </div>
            <div className={classes.details}>
              <div className={classes.detailsrow}>
                <div>Due at Signing</div>
                <div>${due} CAD</div>
              </div>
              <div>First & Last Month Deposit</div>
              <div>ATIC</div>
            </div>
          </div>
          <BottomBlock handleOnClick={handleOnClick}/>
        </div>
      )}
    </div>
  );
}

export default Request;
