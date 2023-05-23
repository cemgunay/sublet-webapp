import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import classes from './DateSelector.module.css'

function DateSelector({ viewingDates, onDateChange, onDeleteDate }) {
  const [datePickers, setDatePickers] = useState([0]);

  const handleAddDatePicker = () => {
    setDatePickers((prev) => [...prev, datePickers.length]);
  };

  const handleDeleteDatePicker = (index) => {
    setDatePickers((prev) => prev.filter((_, i) => i !== index));
    onDeleteDate(index);
  };

  console.log(viewingDates)

  return (
    <Box>
      {datePickers.map((_, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <DatePicker
            value={viewingDates[index] || null}
            openTo="month"
            views={["year", "month", "day"]}
            onChange={(date) => onDateChange(index, date)}
            renderInput={(params) => <Box component="form" {...params} />}
            label={`Viewing day ${index + 1}`}
            disablePast
            disableHighlightToday
          />
            <div className={classes.delete} onClick={() => handleDeleteDatePicker(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
        </Box>
      ))}
      <div onClick={handleAddDatePicker}>
      Add Date
      </div>
    </Box>
  );
}

export default DateSelector;
