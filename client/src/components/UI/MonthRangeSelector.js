import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import "./MonthRangeSelector.css";

const MonthYearRangeSelector = () => {
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [showDates, setShowDates] = useState(false);

  console.log(startMonth);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleStartMonthChange = (date) => {
    const newDate = new Date(date);
    newDate.setDate(1);
    setStartDate(newDate);
    setShowStartDatePicker(true);

    const first = new Date(date);
    first.setDate(1);

    setStartMonth(first);
  };

  const handleEndMonthChange = (date) => {
    const newDate = new Date(date);
    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );
    const lastDate = new Date(lastDayOfMonth);
    const lastDay = lastDate.getDate();
    newDate.setDate(lastDay);
    setEndDate(newDate);
    setShowEndDatePicker(true);

    const last = new Date(date);
    last.setDate(lastDay);
    setEndMonth(last);
  };

  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
  }) => {
    return (
      <div className="react-datepicker__header">
        <div className="react-datepicker__current-month">
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>
      </div>
    );
  };

  const handleOnClick = () => {
    setShowDates(true);
  };

  useEffect(() => {
    if(startDate && endDate){
        setShowDates(false)
    }
  }, [startDate, endDate])
  

  return (
    <div>
      <div onClick={handleOnClick}>
        <p>
          Selected Range:{" "}
          {startDate && endDate
            ? `${startDate.toLocaleDateString("default", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })} - ${endDate.toLocaleDateString("default", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}`
            : "Not selected"}
        </p>
      </div>
      {!showDates ? null : (
        <div>
          <div>
            <label htmlFor="start-month-year-picker">Start Month </label>
            <DatePicker
              id="start-month-year-picker"
              selected={startDate}
              onChange={handleStartMonthChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              placeholderText="Select a month"
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            {showStartDatePicker && (
              <div>
                <label htmlFor="start-date-picker">Move In Date </label>
                <DatePicker
                  wrapperClassName="date-picker"
                  id="start-date-picker"
                  selected={startDate}
                  onChange={handleStartDateChange}
                  startDate={startDate}
                  minDate={startMonth}
                  maxDate={endDate}
                  renderCustomHeader={CustomHeader} // Use the custom header
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="end-month-year-picker">End Month </label>
            <DatePicker
              id="end-month-year-picker"
              selected={endDate}
              onChange={handleEndMonthChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              placeholderText="Select a month"
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
            {showEndDatePicker && (
              <div>
                <label htmlFor="end-date-picker">Move In Date </label>
                <DatePicker
                  popperClassName="date-picker"
                  selected={endDate}
                  id="end-date-picker"
                  onChange={handleEndDateChange}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={endMonth}
                  renderCustomHeader={CustomHeader} // Use the custom header
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearRangeSelector;
