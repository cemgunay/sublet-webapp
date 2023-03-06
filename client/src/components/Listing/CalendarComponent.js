import React, { useState } from "react";
import Calendar from "react-calendar";
//import DateRangePicker from '@wojtekmaj/react-daterange-picker'
//import { DateRangePicker } from '@syncfusion/ej2-calendars';
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";

import { registerLicense } from "@syncfusion/ej2-base";

import "./monthrangepicker-style.css";

registerLicense(
  "@32302e342e30dHVCsXsEHRHE1NOIS5vZONdVmKPnv3wT5e9smQdlu/s=;Mgo DSMBaFt/QHRqVVhkVFpHaV5AQmFJfFBmQ2lYflR0dEUmHVdTRHRcQl5jTH9bd0RnWXxcdXU=;Mgo DSMBMAY9C3t2VVhkQlFacldJXnxIfEx0RWFab1h6dVRMZFxBJAtUQF1hSn5QdkBiUX5fdHRWRGZd;Mgo DSMBPh8sVXJ0S0J XE9AflRBQmJLYVF2R2BJeVRxdV9CYEwxOX1dQl9gSX1Tc0RrWH5acHdXTmE=;@32302e342e30gIzg7j/MUmsMKvORGZen1oZaYcJ77GuZcJRqmt14lk8=;NRAiBiAaIQQuGjN/V0Z WE9EaFtKVmBWf1FpR2NbfE52flRHalhRVBYiSV9jS31TdUVmWHdfcXBVRWNdUA==;NT8mJyc2IWhhY31nfWN9Z2toYHxiYXxhY2Fgc2VpYmJpZ2NzAx5oMDY NCY9MipqahM0PjI6P30wPD4=;ORg4AjUWIQA/Gnt2VVhkQlFacldJXnxIfEx0RWFab1h6dVRMZFxBJAtUQF1hSn5QdkBiUX5fdHRWRWRd;@32302e342e30blQIEANX9PqBZ25MuZHGDQWsX46S2eDpErYCF88GSo8=;@32302e342e30Sn9/hqKxU0dBLhSiy/ioix7ONg5kV6Jn50nkxorbFN0=;@32302e342e30M4oxdSKE twcO7f5EELQyyyhmQwL4lnlSDdiLN280SA=;@32302e342e30jV9qMCMC2IdcFjV7zsIoE9yDlEpP44ZMQybW43qn4E4=;@32302e342e30dHVCsXsEHRHE1NOIS5vZONdVmKPnv3wT5e9smQdlu/s="
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
