import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import Carousel from "../../Carousel/Carousel";
import "react-toastify/dist/ReactToastify.css";
import classes from "./ListingItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import NotificationTenant from "../../Sublets/Notification";
import NotificationSubTenant from "../../Request/Notification";

function ListingItem({ listing, request = {}, booking, mode, onDelete }) {
  const images = listing.images.map(({ url }) => url);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);

  useEffect(() => {
    api.get("/requests/listingrequests/" + listing._id).then((response) => {
      setRequests(response.data);
    });
  }, [listing._id]);

  //get all active requests for listing
  useEffect(() => {
    if (listing) {
      api.get("/requests/listingactiverequests/" + listing._id).then((response) => {
        setActiveRequests(response.data);
      });
    }
  }, [listing._id]);

  const formattedAddress =
    listing.location.address1 +
    ", " +
    listing.location.city +
    ", " +
    listing.location.stateprovince;

  let tenantRequests = requests.filter(
    (request) =>
      request.status !== "rejected" && request.status !== "pendingSubTenant"
  );

  let subtenantRequests = requests.filter(
    (request) => request.status === "pendingSubTenant"
  );

  // Determine the highest active request price
  const highestActiveRequestPrice =
    activeRequests.length > 0
      ? Math.max(
          ...activeRequests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

  // Determine the highest request price (including rejected offers)
  const highestRequestPrice =
    requests.length > 0
      ? Math.max(
          ...requests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

  const priceClass = (request) => {
    if (request.status === "rejected") {
      return classes.rejectedprice;
    } else if (
      request.price === highestActiveRequestPrice &&
      [
        "pendingTenant",
        "confirmed",
        "pendingSubTenantUpload",
        "pendingTenantUpload",
        "pendingFinalAccept",
      ].includes(request.status)
    ) {
      return classes.winningprice;
    } else {
      return classes.losingprice;
    }
  };

  const priceClassForTenant = (
    highestActiveRequestPrice,
    highestRequestPrice
  ) => {
    if (JSON.stringify(booking) !== "{}") {
      return classes.winningprice;
    } else if (
      tenantRequests.length > 0 &&
      highestActiveRequestPrice !== null &&
      subtenantRequests.length === 0
    ) {
      return classes.winningprice;
    } else if (
      tenantRequests.length > 0 &&
      highestActiveRequestPrice !== null &&
      subtenantRequests.length > 0
    ) {
      return highestActiveRequestPrice + "/" + highestRequestPrice ===
        highestRequestPrice
        ? classes.winningprice
        : classes.losingprice;
    } else {
      return classes.losingprice;
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(request);
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const listingContent = (
    <Link
      to={"/listing/" + listing._id}
      state={{ listing: listing }}
      className={classes.linkcontainer}
    >
      <div className={classes.imageContainer}>
        <Carousel dots={true} images={images} index={0} from={"Explore"} />
      </div>
      <div className={classes.content}>
        <div className={classes.first}>
          <h3>{listing.title}</h3>
          <p>{listing.days_left}</p>
        </div>
        <address>{formattedAddress}</address>
        <p>{listing.dates}</p>
        <div className={classes.second}>
          <h3 className={classes.price}>
            {highestActiveRequestPrice
              ? `${highestActiveRequestPrice} Highest Offer`
              : `${listing.price} List Price`}
          </h3>
          <p>
            {tenantRequests.length
              ? `${tenantRequests.length} active bids`
              : `No active bids`}
          </p>
        </div>
      </div>
    </Link>
  );

  const requestContent = (
    <div className={classes.container}>
      {showModal && (
        <div className={classes.modal}>
          <div className={classes.modalcontent}>
            <p>Are you sure you want to delete this request?</p>
            <button onClick={handleDeleteConfirm}>Yes</button>
            <button onClick={handleDeleteCancel}>No</button>
          </div>
        </div>
      )}
      {request.status === "rejected" ? (
        <div className={classes.deleteiconcontainer}>
          <FontAwesomeIcon
            icon={faTrash}
            style={{
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={handleDeleteClick}
          />
        </div>
      ) : null}
      <Link
        to={
          request.status === "rejected" ||
          request.status === "pendingSubTenantUpload" ||
          request.status === "pendingTenantUpload"
            ? `/listing/${listing._id}/request/${request._id}?startDate=${request.startDate}&endDate=${request.endDate}&viewingDate=${request.viewingDate}&price=${request.price}`
            : "/listing/" + listing._id
        }
        className={classes.linkcontainer}
        state={{ stateData: request, listing }}
      >
        <div className={classes.imageContainer}>
          <Carousel dots={true} images={images} index={0} from={"Explore"} />
        </div>
        <div className={classes.content}>
          <NotificationSubTenant request={request} />
          <div className={classes.first}>
            <h3>{listing.title}</h3>
            <p>Listing price: {listing.price}</p>
            <p>{listing.daysLeft} days left</p>
            <p>{listing.days_left}</p>
          </div>
          <address>{formattedAddress}</address>
          <p>{listing.dates}</p>
          <div className={classes.second}>
            <h3 className={priceClass(request)}>
              {request.status === "pendingTenant"
                ? "Your offer:"
                : request.status === "rejected"
                ? "Rejected offer: "
                : request.status === "confirmed"
                ? "Accepted offer: "
                : request.status === "pendingSubTenantUpload" ||
                  request.status === "pendingTenantUpload" ||
                  request.status === "pendingFinalAccept"
                ? "Final Offer: "
                : "Counter offer:"}{" "}
              {request.price}
            </h3>
            <p>{listing.views} views</p>
            <p>{requests.length} bids</p>
          </div>
        </div>
      </Link>
    </div>
  );

  const getOfferText = () => {
    if (JSON.stringify(booking) !== "{}") return "Accepted Offer: ";
    if (
      requests.length === 0 ||
      requests.filter((req) => req.status === "rejected").length ===
        requests.length
    )
      return "No Offers";
    if (
      requests.filter((req) =>
        [
          "pendingSubTenantUpload",
          "pendingTenantUpload",
          "pendingFinalAccept",
        ].includes(req.status)
      ).length > 0
    )
      return "Final Offer: ";
    if (highestActiveRequestPrice) return "Highest Offer: ";
    if (tenantRequests.length === 0) return "Countered Offer: ";
    return null;
  };

  const getOfferPrice = () => {
    if (highestActiveRequestPrice !== null) {
      if (tenantRequests.length > 0 && subtenantRequests.length > 0) {
        return JSON.stringify(booking) !== "{}"
          ? booking?.acceptedPrice
          : highestActiveRequestPrice;
      }
      return highestActiveRequestPrice;
    }
    if (
      tenantRequests.length === 0 &&
      requests.filter((req) => req.status === "rejected").length !==
        requests.length
    )
      return highestRequestPrice;
    return null;
  };

  const listingTenantContent = (
    <Link
      to={"/host/listing/" + listing._id}
      state={{ listing, requests }}
      className={classes.linkcontainer}
    >
      <div className={classes.imageContainer}>
        <Carousel dots={true} images={images} index={0} from={"Explore"} />
      </div>
      <div className={classes.content}>
        <NotificationTenant requests={requests} />
        <div className={classes.first}>
          <h3>{listing.title}</h3>
          <p>Listing price: {listing.price}</p>
          <p>{listing.daysLeft} days left</p>
          <p>{listing.days_left}</p>
        </div>
        <address>{formattedAddress}</address>
        <p>{listing.dates}</p>
        <div className={classes.second}>
          <h3
            className={priceClassForTenant(
              highestActiveRequestPrice,
              highestRequestPrice
            )}
          >
            {getOfferText()}
            {getOfferPrice()}
          </h3>
          <p>{listing.views} views</p>
          <p>{tenantRequests.length} active bids</p>
        </div>
      </div>
    </Link>
  );

  //show highest/counter when there is a "pendingSubTenant" AND "pendingTenant"

  //for rendering
  if (mode === "SubletsSubtenant") {
    return requestContent;
  } else if (mode === "SubletsTenant") {
    return listingTenantContent;
  } else {
    return listingContent;
  }
}

export default ListingItem;
