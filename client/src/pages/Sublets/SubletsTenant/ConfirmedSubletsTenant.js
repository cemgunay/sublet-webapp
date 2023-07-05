import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";

function ConfirmedSubletsTenant() {
  const { user: currentUser } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state for listings with bookings
  const [listingsWithBookingsOrPending, setListingsWithBookingsOrPending] =
    useState([]);

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

        setRequests(allRequests);

        // Filter listings where request status is 'confirmed'
        const listingsWithConfirmedRequestArray = listingsResponse.data.filter(
          (listing) =>
            allRequests.some(
              (request) =>
                request.listingId === listing._id &&
                request.status === "confirmed"
            )
        );

        setListingsWithBookingsOrPending(listingsWithConfirmedRequestArray);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [currentUser]);

  console.log(requests);

  return (
    <div>
      <p>{listingsWithBookingsOrPending.length} confirmed subLets</p>
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
