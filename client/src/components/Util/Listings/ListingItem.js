import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import Carousel from "../../Carousel/Carousel";
import "react-toastify/dist/ReactToastify.css";

import classes from "./ListingItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ListingItem({ listing, request = {}, booking, mode, onDelete }) {
  const images = listing.images.map(({ url }) => url);

  //for number of bids when in subletsSubtenant
  const [requests, setRequests] = useState([]);

  const [showModal, setShowModal] = useState(false);

  //get the number of requests for listing
  useEffect(() => {
    api.get("/requests/listingrequests/" + listing._id).then((response) => {
      setRequests(response.data);
    });
  }, [listing._id]);

  const formattedAddress =
    listing.location.address1 +
    ", " +
    listing.location.city +
    ", " +
    listing.location.stateprovince;

  //to get offers that are pending tenant that arent rejected
  let tenantRequests = requests.filter(
    (request) => request.status === "pendingTenant"
  );

  //check if there is a pendingSubTenant AND pendingTenant at same time
  let subtenantRequests = requests.filter(
    (request) => request.status === "pendingSubTenant"
  );

  //to get highest offer that isnt countered
  const highestRequestFilteredPrice =
    tenantRequests.length > 0
      ? Math.max(
          ...tenantRequests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

  //to get highest offer
  const highestRequestPrice =
    requests.length > 0
      ? Math.max(
          ...requests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

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
          <h3 className={classes.price}>{listing.price}</h3>
          <p>{listing.views}</p>
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
              className={
                (request.price === highestRequestPrice &&
                  request.status !== "pendingSubTenant" &&
                  request.status !== "rejected") ||
                request.status === "accepted"
                  ? classes.winningprice
                  : request.status === "rejected"
                  ? classes.rejectedprice
                  : classes.losingprice
              }
            >
              {request.status === "pendingTenant"
                ? "Your offer:"
                : request.status === "rejected"
                ? "Rejected offer: "
                : request.status === "accepted"
                ? "Accepted offer: "
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

  const listingTenantContent = (
    <Link
      to={"/host/listing/" + listing._id}
      state={{ listing: listing, requests: requests }}
      className={classes.linkcontainer}
    >
      <div className={classes.imageContainer}>
        <Carousel dots={true} images={images} index={0} from={"Explore"} />
      </div>
      <div className={classes.content}>
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
            className={
              tenantRequests.length > 0 &&
              subtenantRequests.length === 0 &&
              requests.length !== 0
                ? classes.winningprice
                : request.status === "rejected"
                ? classes.rejectedprice
                : JSON.stringify(booking) !== "{}"
                ? classes.winningprice
                : classes.losingprice
            }
          >
            {JSON.stringify(booking) !== "{}"
              ? "Accepted Offer: "
              : requests.length === 0 ||
                requests.filter((request) => request.status === "rejected")
                  .length === requests.length
              ? "No Offers"
              : tenantRequests.length > 0 && subtenantRequests.length > 0
              ? "Highest/Countered Offer: "
              : highestRequestFilteredPrice
              ? "Highest Offer: "
              : tenantRequests.length === 0
              ? "Countered Offer: "
              : null}
            {highestRequestFilteredPrice !== null
              ? tenantRequests.length > 0 && subtenantRequests.length > 0
                ? JSON.stringify(booking) !== "{}"
                  ? booking?.acceptedPrice
                  : highestRequestFilteredPrice + "/" + highestRequestPrice
                : highestRequestFilteredPrice
              : tenantRequests.length === 0 &&
                requests.filter((request) => request.status === "rejected")
                  .length !== requests.length
              ? highestRequestPrice
              : null}
          </h3>
          <p>{listing.views} views</p>
          <p>{requests.length} bids</p>
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
