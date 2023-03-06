import React from 'react'

import classes from './BottomBar.module.css'

function BottomBar(props) {

    console.log(props.listing)

    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    console.log(props.dates)

  return (
    <footer className={classes.wrapper}>
        <div className={classes.container}>
        <div classes={classes.left}>
            <div>
            {props.listing.price} month
            </div>
            <div>
            {month[props.dates[0].getMonth()]} - 
            {month[props.dates[1].getMonth()]}
            </div>
        </div>
        <div>
            Request
        </div>

        </div>
    </footer>
  )
}

export default BottomBar