import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import classes from "./Notification.module.css";

function Notification({ requests }) {
  const [remainingTime, setRemainingTime] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket.io
  useEffect(() => {
    const socket = socketIOClient("http://localhost:8080");
    setSocket(socket);
    console.log("Socket connected: ", socket.connected);
    return () => {
      socket.disconnect();
    };
  }, []);

  // Listen for 'countdown' events
  useEffect(() => {
    if (socket) {
      socket.on("countdown", (endTime) => {
        console.log("Countdown event received", endTime);
        // Calculate initial remaining time
        let remainingTime = Math.max(0, endTime - Date.now());
        setRemainingTime(remainingTime);

        // Start countdown
        const countdownInterval = setInterval(() => {
          remainingTime = Math.max(0, endTime - Date.now());
          setRemainingTime(remainingTime);
          if (remainingTime <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      });
    }
  }, [socket]);

  // Start countdown when a pending acceptance request is rendered
  useEffect(() => {
    const pendingRequest = requests.find((request) =>
      [
        "pendingSubTenantUpload",
        "pendingTenantUpload",
        "pendingFinalAccept",
      ].includes(request.status)
    );
    if (socket && pendingRequest && remainingTime === null) {
      console.log("hello");
      socket.emit("startCountdown", pendingRequest._id);
    }
  }, [socket, requests, remainingTime]);

  /*
  //Continually decrease remaining time
  useEffect(() => {
    if (remainingTime !== null) {
      const countdownInterval = setInterval(() => {
        setRemainingTime((remainingTime) => remainingTime - 1000);
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [remainingTime]);
  */

  // Calculate the remaining time in hours, minutes, and seconds
  const hours = Math.floor(remainingTime / (60 * 60 * 1000));
  const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

  const timerComponent = remainingTime ? (
    <div>
      Time Remaining: {hours}:{minutes}:{seconds}
    </div>
  ) : null;

  return (
    <div>
      {requests.filter((request) => request.status === "pendingSubTenantUpload")
        .length > 0 ? (
        <div className={classes.contentcontainer}>
          Waiting for subtenant to upload
          {timerComponent}
        </div>
      ) : requests.filter((request) => request.status === "pendingTenantUpload")
          .length > 0 ? (
        <div className={classes.contentcontainer}>
          You need to upload
          {timerComponent}
        </div>
      ) : requests.filter((request) => request.status === "pendingFinalAccept")
          .length > 0 ? (
        <div className={classes.contentcontainer}>
          Waiting for verification and signing
          {timerComponent}
        </div>
      ) : (
        requests.filter((request) => request.status === "pendingFinalAccept")
          .length > 0 && (
          <div className={classes.contentcontainer}>
            You need to verify and sign
            {timerComponent}
          </div>
        )
      )}
    </div>
  );
}

export default Notification;
