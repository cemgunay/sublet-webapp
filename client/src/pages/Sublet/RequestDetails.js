import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import MonthGrid from "../../components/Util/MonthGrid";

import classes from "./RequestDetails.module.css";
import BottomBlock from "../../components/UI/BottomBlock";
import DeclineModal from "../../components/Sublets/DeclineModal";
import useRequestFormContext from "../../hooks/useRequestFormContext";

function RequestDetails() {
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  const { listingId, requestId } = useParams();
  const location = useLocation();
  const { state } = location;

  const [listing, setListing] = useState(null);
  const [request, setRequest] = useState([]);

  //to set the initial dates for MonthGrid
  const [defaultMoveInDate, setDefaultMoveInDate] = useState(null);
  const [defaultMoveOutDate, setDefaultMoveOutDate] = useState(null);


  //from context
  const { data, setData, handleChange } = useRequestFormContext();

  //if there is no state, take listing from parameters and DB
  useEffect(() => {
    if (!state || !state.listing) {
      api.get("/listings/" + listingId).then((response) => {
        setListing(response.data);
      });
    } else {
      setListing(state.listing);
    }
  }, [listingId, state]);

  //if there is no state, take requests from parameters and DB
  useEffect(() => {
    if (!state || !state.requests) {
      api.get("/requests/" + requestId).then((response) => {
        setRequest(response.data);
        setDefaultMoveInDate(response.data.startDate);
        setDefaultMoveOutDate(response.data.endDate);
      });
    } else {
      setRequest(state.requests);
      setDefaultMoveInDate(state.requests.startDate);
      setDefaultMoveOutDate(state.requests.endDate);
    }
  }, [requestId, state]);

  //when request updates also update data
  useEffect(() => {
    setData(request)
  }, [request, setData])
  

  //to get the month name from ISO
  const getMonth = (date) => {
    const dateToChange = new Date(date);
    const options = { month: "short", year: "numeric" };
    const monthYearString = dateToChange.toLocaleDateString("en-US", options);
    return monthYearString;
  };

  //to format date
  function formatDate(dateString) {
    if (!dateString) {
      return "No viewing date selected";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString();
  }

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
  const subTotal = parseFloat(
    (request.price * getMonthDiff(request.startDate, request.endDate)).toFixed(
      2
    )
  );

  const atic = parseFloat(
    (
      (request.price * 2) *
      0.04
    ).toFixed(2)
  );

  const total = (subTotal + atic).toFixed(2);
  const due = (request.price * 2) + atic;

  const navigate = useNavigate();

  const handleAccept = () => {

    api.post('/bookings/' + listing._id + '/' + request._id)
    .then((response) => {
        console.log(response)
        navigate('/host')
    }).catch((error) => console.error(error));
  }

  const [openModal, setOpenModal] = useState(false)

  const handleDecline = () => {
    setOpenModal(true)
}

  return (
    <div>
      <div className={classes.contentcontainer}>
        {!request._id !== "" && !listing && !data._id ? (
          <div>loadingg</div>
        ) : (
          <div>
            <MonthGrid
              defaultMoveInDate={request.startDate}
              defaultMoveOutDate={request.endDate}
              moveInDate={request.startDate}
              moveOutDate={request.endDate}
              shorterStays={false}
            />
            <div className={classes.requestdetailscontainer}>
              Your Request
              <div className={classes.details}>
                <div>subLet months</div>
                {getMonth(request.startDate)} -{getMonth(request.endDate)}
                <div>Move in - Move out</div>
                {new Date(request.startDate)?.toLocaleDateString()} -{" "}
                {new Date(request.endDate)?.toLocaleDateString()}
              </div>
              <div className={classes.details}>
                <div>viewing date</div>
                {formatDate(request.viewingDate) ?? "No viewing date selected"}
              </div>
              <div className={classes.details}>
                <div>price details</div>
                <div className={classes.detailsrow}>
                  <div>
                    ${request.price} CAD x{" "}
                    {getMonthDiff(request.startDate, request.endDate)} months
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
            {!openModal ? null : <DeclineModal openModal={openModal} setOpenModal={setOpenModal} request={request} data={data} setData={setData} handleChange={handleChange} defaultMoveInDate={defaultMoveInDate} defaultMoveOutDate={defaultMoveOutDate}/>}
            <BottomBlock  handleAccept={handleAccept} handleDecline={handleDecline} from={'RequestDetails'}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestDetails;
