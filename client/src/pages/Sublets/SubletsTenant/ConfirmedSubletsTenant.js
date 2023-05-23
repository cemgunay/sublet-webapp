import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";

function ConfirmedSubletsTenant() {
  const { user: currentUser } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state for listings with bookings
  const [listingsWithBookingsOrPending, setListingsWithBookingsOrPending] = useState([]);

  //to fetch all booked listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsResponse = await api.get(
          "/listings/listingspublished/" + currentUser._id
        );
        console.log(listingsResponse.data);

        const requestPromises = listingsResponse.data.map((listing) =>
          api.get("/requests/listing/" + listing._id)
        );

        const requestResponse = await Promise.all(requestPromises);

        console.log(requestResponse);

        const allRequests = requestResponse.flatMap(
          (response) => response.data
        );

        setRequests(allRequests)
        
        // Filter out listings where request status is 'pending' or rejected
        const listingsWithoutPendingRequestArray = listingsResponse.data.filter(
          (listing) =>
            !allRequests.some((request) => request.listingId === listing._id && (request.status === 'pendingTenant' && request.status === 'pendingSubTenant' && request.status === 'rejected'))
        );

        setListingsWithBookingsOrPending(listingsWithoutPendingRequestArray);


        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [currentUser]);

  console.log(requests)

  return (
    <div>
      <p>{listingsWithBookingsOrPending.length} accepted subLets</p>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList
            requests={requests}
            listings={listingsWithBookingsOrPending}
            bookings={requests}
            mode="SubletsTenant"
          />
        )}
      </div>
    </div>
  );
}

export default ConfirmedSubletsTenant;
