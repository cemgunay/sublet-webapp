import React from "react";
import { useContext, useEffect, useState } from "react";
import BigCard from "../../components/UI/BigCard";
import { AuthContext } from "../../context/AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom";

import api from "../../api/axios";

import classes from "./Publish.module.css";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers";
import DateSelector from "../../components/List/DateSelector";
import BottomBar from "../../components/List/BottomBar";
import Preview from "../../components/List/Preview";

function Publish() {
  const { user: currentUser } = useContext(AuthContext);

  const {
    data,
    handleChange,
    loading,
    urlTitleReverse,
    page,
    setPage,
    currentUserId,
    setData,
    canGoNext,
  } = useOutletContext();

  const handleOnChangeMoveIn = (newValue) => {
    console.log(newValue);

    const e = {
      name: "moveInDate",
      value: newValue,
    };

    handleChange(e);
  };

  const handleOnChangeMoveOut = (newValue) => {
    const e = {
      name: "moveOutDate",
      value: newValue,
    };

    handleChange(e);
  };

  const [moveInExists, setMoveInExists] = useState(false);
  const [moveOutExists, setMoveOutExists] = useState(false);

  useEffect(() => {
    console.log(data);

    if (data && data.moveInDate) {
      console.log(data.moveInDate.$d || "");
      setMoveInExists(true);
    } else {
      console.log("Data or moveInDate property is null or undefined.");
    }

    if (data && data.moveOutDate) {
      console.log(data.moveOutDate.$d || "");
      setMoveOutExists(true);
    } else {
      console.log("Data or moveInDate property is null or undefined.");
    }
  }, [data]);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [viewingDates, setViewingDates] = useState([]);

  console.log(viewingDates);

  const handleDateChange = (index, date) => {
    const newViewingDates = [...viewingDates];
    newViewingDates[index] = date;
    setViewingDates(newViewingDates);

    const e = {
      name: "viewingDates",
      value: viewingDates,
    };

    handleChange(e);
  };

  const handleDeleteDate = (index) => {
    const newViewingDates = viewingDates.filter((_, i) => i !== index);
    setViewingDates(newViewingDates);
  };

  const [seePreview, setSeePreview] = useState(false);

  const handleClick = () => {
    setSeePreview(true);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setData((prevData) => ({
      ...prevData,
      published: true,
    }));

    const { _id, published, ...updateData } = data;
    const updatedData = {
      ...updateData,
      published: true,
    };

    try {
      await api.put("/listings/" + data._id, updatedData);
    } catch (err) {
      console.log(err);
    }

    //localStorage.setItem("listId", JSON.stringify(""))

    //navigate("/list");
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.title}>
          <div>{currentUser.firstName}! It's time to publish!</div>
          <div>
            Here’s what we’ll show as your listing. Before you publish, make
            sure to review the details.
          </div>
        </div>
      </div>
      {seePreview ? (
        <div className={classes.modalOverlay}>
          <div
            className={`${classes.previewModal} ${
              seePreview ? classes.slideUp : classes.slideDown
            }`}
          >
            <Preview
              data={data}
              setSeePreview={setSeePreview}
              currentUser={currentUser}
              moveInExists={moveInExists}
              moveOutExists={moveOutExists}
              options={options}
            />
          </div>
        </div>
      ) : null}
      {loading ? (
        <div>LOADING</div>
      ) : (
        <div className={classes.listingpreviewcontainer}>
          <div className={classes.bigcardcontainer}>
            <div className={classes.bigcard}>
              <BigCard data={data} handleClick={handleClick} />
            </div>
            <div className={classes.seepreview} onClick={handleClick}>
              see preview
            </div>
          </div>
        </div>
      )}
      <form id="publish" onSubmit={handleSubmit} className={classes.content}>
        <div className={classes.movingdatescontainer}>
          <div>Set Up subLet availability</div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"Move-In"}
              openTo="month"
              value={data.moveInDate}
              onChange={handleOnChangeMoveIn}
              views={["year", "month", "day"]}
              disablePast
            />
            <DatePicker
              label={"Move-Out"}
              openTo="month"
              value={data.moveOutDate}
              onChange={handleOnChangeMoveOut}
              views={["year", "month", "day"]}
              minDate={data.moveInDate}
              disablePast
              disableHighlightToday
            />

            {!moveOutExists ||
            !data.moveOutDate ||
            !moveInExists ||
            !data.moveInDate ? null : (
              <div>
                {data.moveInDate.$d.toLocaleDateString("en-US", options)} -{" "}
                {data.moveOutDate.$d.toLocaleDateString("en-US", options)}
              </div>
            )}
          </LocalizationProvider>
        </div>
        <div className={classes.shorterstayscontainer}>
          <div>Allow for shorter stays?</div>
          <input
            name="shorterStays"
            type="checkbox"
            checked={data.shorterStays}
            onChange={handleChange}
          />
        </div>
        <div className={classes.whatsnextcontainer}>
          <div>What's next?</div>
          <div className={classes.viewingdatescontainer}>
            {data.moveInDate && data.moveOutDate ? (
              <>
                <div>Set up viewing availability</div>
                <div className={classes.shorterstayscontainer}>
                  <div>Available to view?</div>
                  <input
                    name="availableToView"
                    type="checkbox"
                    checked={data.availableToView}
                    onChange={handleChange}
                  />
                </div>
                {!data.availableToView ? null : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateSelector
                      viewingDates={viewingDates}
                      onDateChange={handleDateChange}
                      onDeleteDate={handleDeleteDate}
                    />
                  </LocalizationProvider>
                )}

                <div>DW you can always change this</div>
              </>
            ) : null}
          </div>
          <div>
            <div>Confirm a few details and publish</div>
            <div>
              We'll let you know if you need to verify your identity or any
              other needed documents
            </div>
          </div>
        </div>
        <BottomBar
          form={urlTitleReverse[page]}
          page={page}
          setPage={setPage}
          urlTitleReverse={urlTitleReverse}
          listId={data._id}
          currentUserId={currentUserId}
          data={data}
          setData={setData}
          canGoNext={canGoNext}
        />
      </form>
    </div>
  );
}

export default Publish;
