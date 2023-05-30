import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";
import useAuth from "../../../hooks/useAuth";

function ActiveSubletsTenant() {
  //this is shortcut for useContext(AuthContext);
  const { user: currentUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  //to fetch all active listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsResponse = await api.get(
          "/listings/listingspublished/" + currentUser._id
        );

        const requestPromises = listingsResponse.data.map(async (listing) => {
          const requestResponse = await api.get(
            "/requests/listing/" + listing._id
          );
          return {
            ...listing,
            requests: requestResponse.data,
          };
        });

        const listingsWithRequests = await Promise.all(requestPromises);

        // Remove listings that have an accepted/confirmed requests
        const filteredListings = listingsWithRequests.filter(
          (listing) =>
            !listing.requests.some((request) => request.status === "confirmed")
        );

        // Sort listings to have ones with pendingSubTenantUpload, pendingTenantUpload or pendingFinalAccept at the top
        const sortedListings = filteredListings.sort((listingA, listingB) => {
          const listingAHasPendingStatus = listingA.requests.some(
            (request) =>
              request.status === "pendingSubTenantUpload" ||
              request.status === "pendingTenantUpload" ||
              request.status === "pendingFinalAccept"
          );

          const listingBHasPendingStatus = listingB.requests.some(
            (request) =>
              request.status === "pendingSubTenantUpload" ||
              request.status === "pendingTenantUpload" ||
              request.status === "pendingFinalAccept"
          );

          if (listingAHasPendingStatus && !listingBHasPendingStatus) {
            return -1; // listingA should come first
          }
          if (!listingAHasPendingStatus && listingBHasPendingStatus) {
            return 1; // listingB should come first
          }
          return 0; // they are equal
        });

        console.log(sortedListings);

        setRequests(
          listingsWithRequests.flatMap((listing) => listing.requests)
        );
        setListings(sortedListings);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [currentUser]);

  return (
    <div>
      <p>{listings.length} active subLets</p>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList
            requests={requests}
            listings={listings}
            mode="SubletsTenant"
          />
        )}
      </div>
    </div>
  );
}

export default ActiveSubletsTenant;
