import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";

function ActiveSubletsSubtenant() {
  const { user: currentUser } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  //to fetch all active requests
  useEffect(() => {
    const fetchRequests = async () => {
      const filters = {
        active: true,
      };

      try {
        const requestsResponse = await api.get(
          "/requests/myrequests/" + currentUser._id,
          {
            params: {
              filters: JSON.stringify(filters),
            },
          }
        );
        console.log(requestsResponse.data);

        // Here is the new sort function
        requestsResponse.data.sort((a, b) => {
          const statusOrder = [
            "pendingFinalAccept",
            "pendingSubTenantUpload",
            "pendingTenantUpload",
            "pendingSubTenant",
            "pendingTenant",
            "rejected",
            "confirmed",
          ];

          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

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
      <p>{requests.length} active subLets</p>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList
            requests={requests}
            listings={listings}
            mode="SubletsSubtenant"
          />
        )}
      </div>
    </div>
  );
}

export default ActiveSubletsSubtenant;
