import React from "react";
import ListingItem from "./ListingItem";

import classes from "./ListingList.module.css";

function ListingList({ listings, requests, bookings, mode, onDelete }) {

  //const images = props.data.images.map(({ url }) => url);

  console.log(bookings)

  const renderTenant = () => {
    return listings.map((listing) => {
      // If mode is 'SubletsTenant', filter the requests for the current listing
      const listingRequests = mode === 'SubletsTenant' ? requests.filter((request) => request.listingId === listing._id) : [];
      //had to do this because i allowed for multiple bookings oops
      const booking = mode === 'SubletsTenant' && bookings ? bookings[bookings.length - 1] : {}
      return <ListingItem key={listing._id} listing={listing} booking={booking} mode={mode}/>;
    });
  };

  const renderRequestsOrListings = () => {
    return requests
      ? requests.map((request) => {
        const listing = listings.find(l => l.id === request.listingId);
        console.log(request)
         return <ListingItem key={request._id} request={request} listing={listing} mode={mode} onDelete={onDelete}/>
      })
      : listings.map((listing) => (
          <ListingItem key={listing.id} listing={listing} mode={mode}/>
        ))
  };

  return (
    <div className={classes.container}>
       {mode === 'SubletsTenant' ? renderTenant() : renderRequestsOrListings()}
    </div>
  );
}

export default ListingList;

//.sort( (a,b) => a.price > b.price ? 1 : -1)
