import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import api from "../../api/axios";

import classes from "./CurrentOffer.module.css";
import { useEffect, useState } from "react";

function CurrentOffer({ data, listing, isBooked, booking }) {
  const [requests, setRequests] = useState([]);

  //get the number of requests for listing
  useEffect(() => {
    api.get("/requests/listingrequests/" + listing._id).then((response) => {
      setRequests(response.data);
    });
  }, [listing._id]);

  const highestRequestPrice =
    requests.length > 0
      ? Math.max(
          ...requests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

  console.log(data);

  return (
    <div className={classes.container}>
      {isBooked ? (
        <div>
          This listing has been booked: $
          {booking[booking.length - 1].acceptedPrice}
        </div>
      ) : (
        <div>
          <div>
            {data.status === "pendingSubTenant" ||
            data.price !== highestRequestPrice ? (
              data.status === "rejected" ? (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className={classes.iconxred}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className={classes.iconx}
                />
              )
            ) : data.status === "rejected" ? (
              <FontAwesomeIcon
                icon={faCircleXmark}
                className={classes.iconxred}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleCheck}
                className={classes.iconcheck}
              />
            )}
          </div>
          <div>
            {data.status === "pendingTenant"
              ? `My current offer: ${data.price}`
              : data.status === "rejected"
              ? "Your offer has been rejected"
              : `Tenant counter offer: ${data.price}`}
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentOffer;
