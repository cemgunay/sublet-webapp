import React from "react";
import ListingItem from "./ListingItem";

import classes from "./ListingList.module.css";

function ListingList({ listings, requests, mode }) {
  //const images = props.data.images.map(({ url }) => url);

  const renderTenant = () => {
    return listings.map((listing) => {
      // If mode is 'SubletsTenant', filter the requests for the current listing
      const listingRequests = mode === 'SubletsTenant' ? requests.filter((request) => request.listingId === listing._id) : [];
      return <ListingItem key={listing._id} listing={listing} requests={listingRequests} />;
    });
  };

  const renderRequestsOrListings = () => {
    return requests
      ? requests.map((request) => {
        const listing = listings.find(l => l.id === request.listingId);
         return <ListingItem key={request._id} request={request} listing={listing}/>
      })
      : listings.map((listing) => (
          <ListingItem key={listing.id} listing={listing} />
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
