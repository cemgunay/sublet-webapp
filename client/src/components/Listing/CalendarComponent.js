import React, { useState } from "react";
import Calendar from "react-calendar";
//import DateRangePicker from '@wojtekmaj/react-daterange-picker'
//import { DateRangePicker } from '@syncfusion/ej2-calendars';
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";

import { registerLicense } from "@syncfusion/ej2-base";

import "./monthrangepicker-style.css";

registerLicense(
  "Mgo+DSMBaFt/QHRqVVhkVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jSn9Qd0BmWX9ZdXxWQQ==;Mgo+DSMBPh8sVXJ0S0J+XE9AflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TdURgWHpbcHRSQGRaVg==;ORg4AjUWIQA/Gnt2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZiWn5bdXRVQWZaWUM=;MTMxNTIzNUAzMjMwMmUzNDJlMzBiQks0dFVKRFJ3SkF6K0JGU1NUUytSZ1U1bTFVVWlCM0xGd1AvRkF6Z09VPQ==;MTMxNTIzNkAzMjMwMmUzNDJlMzBKak94aGtUNUxnYU5aNHVyUkU3Zk9aMWZNZEFxU3ZXWVJCSWdIN24vKzh3PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdUVgWHxfdXFVRmdbVEFx;MTMxNTIzOEAzMjMwMmUzNDJlMzBkNnovNk00Z1ZvUkhMSDhSVnpaSXVMRG1icFFqNVowalFzamo4R2lPUTdjPQ==;MTMxNTIzOUAzMjMwMmUzNDJlMzBLcTRMRnJrMittM012QU1hK0Q0VHBqT1cwSk5HbmM1NER3SjRRS1RXQWdzPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZiWn5bdXRVQWheV0M=;MTMxNTI0MUAzMjMwMmUzNDJlMzBrVW9YK1c3VC9LYm9MbUcrRUwwNStkQS9hVGh0eFBPenI1NWFWMENrTktNPQ==;MTMxNTI0MkAzMjMwMmUzNDJlMzBoM05NUkpLNDdJVUdPbm9XTklzM3RZNk13dTZjUU42VThvdkt6L3hLMUVBPQ==;MTMxNTI0M0AzMjMwMmUzNDJlMzBkNnovNk00Z1ZvUkhMSDhSVnpaSXVMRG1icFFqNVowalFzamo4R2lPUTdjPQ=="
);

//import 'react-calendar/dist/Calendar.css';

//import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
//import 'react-calendar/dist/Calendar.css';

function CalendarComponent({dates, setDates}) {

  const start = "Year";
  const depth = "Year";

  const handleOnChange = (e) => {
    setDates(e.target.value)
  }

  return (
    <>
      <div className="daterangepicker-control-section">
        <DateRangePickerComponent
          format="MMM/yyyy"
          start={start}
          depth={depth}
          onChange={handleOnChange} 
          value={dates}
        ></DateRangePickerComponent>
      </div>
    </>
  );
}

export default CalendarComponent;

//<Calendar onChange={onChange} value={value} />
//<DateRangePicker onChange={onChange} value={value} closeCalendar={false} view={"month"}/>
