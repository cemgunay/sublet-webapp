import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";

function ConfirmedSubletsSubtenant() {
  const { user: currentUser } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  //to fetch all confirmed requests
  useEffect(() => {
    const fetchRequests = async () => {

      const filters = {
        accepted: true
      };

      try {
        const requestsResponse = await api.get(
          "/requests/myrequests/" + currentUser._id, {
            params: {
              filters: JSON.stringify(filters)
            }
          }
        );
        console.log(requestsResponse.data);
        setRequests(requestsResponse.data);

        const listingPromises = requestsResponse.data.map((request) =>
          api.get("/listings/" + request.listingId)
        );

        const listingsResponse = await Promise.all(listingPromises);

        console.log(listingsResponse);

        setListings(listingsResponse.map((response) => response.data));

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, [currentUser]);

  return (
    <div>
      <p>{requests.length} confirmed subLets</p>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList requests={requests} listings={listings} mode="SubletsSubtenant"/>
        )}
      </div>
    </div>
  );
}

export default ConfirmedSubletsSubtenant;