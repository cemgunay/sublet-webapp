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

  useEffect(() => {
    api.get("/requests/listingrequests/" + listing._id).then((response) => {
      setRequests(response.data);
    });
  }, [listing._id]);

  const activeRequests = requests.filter(
    (request) => request.status !== "rejected"
  );

  const highestRequestPrice =
    activeRequests.length > 0
      ? Math.max(
          ...activeRequests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

  const getOfferStatusIcon = () => {
    if (data.status === "rejected") {
      return (
        <FontAwesomeIcon icon={faCircleXmark} className={classes.iconxred} />
      );
    }

    if (
      data.price !== highestRequestPrice ||
      ["pendingSubTenant", "rejected"].includes(data.status)
    ) {
      return <FontAwesomeIcon icon={faCircleXmark} className={classes.iconx} />;
    }

    return (
      <FontAwesomeIcon icon={faCircleCheck} className={classes.iconcheck} />
    );
  };

  const getOfferStatusText = () => {
    switch (data.status) {
      case "pendingTenant":
        return `My current offer: ${data.price}`;
      case "rejected":
        if (data.status_reason === "Offer has been rejected") {
          return "Your offer has been rejected";
        } else if (data.status_reason === "Counter offer has been rejected") {
          return "You rejected counter offer";
        }
        break; // It's a good practice to add a break even if the code never reaches here
      case "pendingSubTenantUpload":
      case "pendingTenantUpload":
      case "pendingFinalAccept":
        return `Final offer: ${data.price}`;
      default:
        return `Tenant counter offer: ${data.price}`;
    }
  };

  return (
    <div className={classes.container}>
      {isBooked ? (
        <div>This listing has been booked: ${booking.acceptedPrice}</div>
      ) : (
        <div>
          <div>{getOfferStatusIcon()}</div>
          <div>{getOfferStatusText()}</div>
        </div>
      )}
    </div>
  );
}

export default CurrentOffer;
