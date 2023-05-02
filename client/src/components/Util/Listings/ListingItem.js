import React from "react";
import { Link } from "react-router-dom";
import Carousel from "../../Carousel/Carousel";

import classes from "./ListingItem.module.css";

function ListingItem({ listing, request = {}, requests = [] }) {

  const images = listing.images.map(({ url }) => url);

  const formattedAddress =
    listing.location.address1 +
    ", " +
    listing.location.city +
    ", " +
    listing.location.stateprovince;

  const highestRequestPrice =
    requests.length > 0
      ? Math.max(
          ...requests.map((request) =>
            isNaN(request.price) ? -Infinity : request.price
          )
        )
      : null;

  const listingContent = (
    <Link
      to={"/listing/" + listing._id}
      state={{ listing: listing }}
      className={classes.container}
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
    <Link
      to={`/listing/${listing._id}/request/${request._id}?startDate=${request.startDate}&endDate=${request.endDate}&viewingDate=${request.viewingDate}&price=${request.price}`}
      state={{ stateData: request, listing }}
      className={classes.container}
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
          <h3 className={classes.price}>{request.price}</h3>
          <p>{listing.views}</p>
        </div>
      </div>
    </Link>
  );

  const listingTenantContent = (
    <Link
      to={"listing/" + listing._id}
      state={{ listing: listing, requests: requests }}
      className={classes.container}
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
            {listing.price}
          </h3>
          <div>
            highest bid:
          </div>
          <h3 className={classes.price}>
            {highestRequestPrice !== null ? highestRequestPrice : 'no bids'}
          </h3>
          <p>{listing.views}</p>
        </div>
      </div>
    </Link>
  );

  //for rendering
  if (request._id) {
    return requestContent;
  } else if (requests.length > 0) {
    return listingTenantContent;
  } else {
    return listingContent;
  }
}

export default ListingItem;
