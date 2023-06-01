import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const Countdown = ({ acceptanceTimestamp }) => {
  const [remainingTime, setRemainingTime] = useState(
    acceptanceTimestamp ? calculateRemainingTime(acceptanceTimestamp) : null
  );

  const calculateRemainingTime = (acceptanceTimestamp) => {
    const timeElapsed = Date.now() - acceptanceTimestamp;
    return Math.max(0, 12 * 60 * 60 * 1000 - timeElapsed); // 12 hours in milliseconds
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime(acceptanceTimestamp));
    }, 1000);

    return () => clearInterval(timer);
  }, [acceptanceTimestamp]);

  if (remainingTime === null) {
    return <div>Loading...</div>; // or some other loading state
  }

  let hours = Math.floor(remainingTime / (60 * 60 * 1000));
  let minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
  let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

  return (
    <div>
      {hours}h {minutes}m {seconds}s remaining
    </div>
  );
};

export default Countdown;
