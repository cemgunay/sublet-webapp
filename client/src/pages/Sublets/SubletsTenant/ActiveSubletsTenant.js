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

        const requestPromises = listingsResponse.data.map((listing) =>
          api.get("/requests/listing/" + listing._id)
        );

        const requestsResponse = await Promise.all(requestPromises);

        const allRequests = requestsResponse.flatMap(
          (response) => response.data
        );

        // Remove listings that have an accepted/confirmed/pendingSubTenantUpload/pendingTenantUpload requests
        const filteredListings = listingsResponse.data.filter((listing) => {
          return !allRequests.some(
            (request) =>
              request.listingId === listing._id &&
              (request.status === "accepted" ||
                request.status === "pendingSubTenantUpload" ||
                request.status === "pendingTenantUpload" ||
                request.status === "confirmed")
          );
        });

        console.log(filteredListings);

        setRequests(allRequests);
        setListings(filteredListings);

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
