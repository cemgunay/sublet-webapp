import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";

import { toast } from "react-toastify";

function PastSubletsSubtenant() {
  const { user: currentUser } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  //to fetch all past requests with showSubTenant true
  useEffect(() => {
    const fetchRequests = async () => {
      const filters = {
        past: true,
        showSubTenant: true
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

  //This is for deleting past requests
  const handleDeleteConfirm = (requestToDelete) => {

    const updateRequest = {
      subTenantId: requestToDelete.subTenantId,
      tenantId: requestToDelete.tenantId,
      showSubTenant: false
    };

    api
      .put("/requests/update/" + requestToDelete._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        const updatedRequests = requests.filter(request => request._id !== requestToDelete._id)
        setRequests(updatedRequests)
        toast.success("Past request deleted successfully");
      })
      .catch((error) => {
        toast.error("Failed to delete past request: " + error.message);
        console.error(error);
      });
  };

  return (
    <div>
      <p>{requests.length} past subLets</p>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList requests={requests} listings={listings} mode="SubletsSubtenant" onDelete={handleDeleteConfirm}/>
        )}
      </div>
    </div>
  );
}
export default PastSubletsSubtenant;
