import React from 'react'
import IncrementalInputField from '../Util/IncrementalInputField';

import classes from './BottomBar.module.css'

function BottomBar({ listing }) {

    const getMonth = (date) => {
        const dateToChange = new Date(date);
        const options = { month: "short", year: "numeric" };
        const monthYearString = dateToChange.toLocaleDateString("en-US", options);
        return monthYearString;
      };


  return (
    <footer className={classes.wrapper}>
      {!listing ? null : (
        <div className={classes.container}>
          <div classes={classes.left}>
            <IncrementalInputField
              data={listing}
              type="price"
              from="ManageListing"
            />
            <div>
              {getMonth(listing.moveInDate)} -{getMonth(listing.moveOutDate)}
            </div>
          </div>
          <div>Request</div>
        </div>
      )}
    </footer>
  )
}

export default BottomBar