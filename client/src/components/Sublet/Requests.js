import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import RequestItem from "./RequestItem";

import "react-toastify/dist/ReactToastify.css";

function Requests({ requests, listing, onDelete }) {
  const [updatedRequests, setUpdatedRequests] = useState(null);

  const [openPastOffers, setOpenPastOffers] = useState(false);

  useEffect(() => {
    const fetchUser = async (subTenantId) => {
      try {
        const response = await api.get("/users/id/" + subTenantId);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const statusWeight = (status) => {
      switch (status) {
        case "pendingFinalAccept":
          return 3;
        case "pendingTenantUpload":
          return 2;
        case "pendingSubTenantUpload":
          return 1;
        default:
          return 0;
      }
    };

    const loadRequests = async () => {
      const newRequests = await Promise.all(
        requests.map(async (request) => {
          const user = await fetchUser(request.subTenantId);
          return {
            ...request,
            user,
          };
        })
      );

      newRequests.sort(
        (a, b) => statusWeight(b.status) - statusWeight(a.status)
      );

      setUpdatedRequests(newRequests);
    };

    loadRequests();
  }, [requests]);

  console.log(updatedRequests);

  const goToPastOffers = () => {
    setOpenPastOffers(!openPastOffers);
  };

  return (
    <div>
      <h2>Request List</h2>
      <div onClick={goToPastOffers}>
        {openPastOffers ? "Active Offers" : "Past Offers"}
      </div>
      {openPastOffers ? (
        <>
          {updatedRequests ? (
            updatedRequests
              .filter(
                (request) => request.status === "rejected" && request.showTenant
              )
              .map((request) => (
                <RequestItem
                  key={request._id}
                  name={request.user.firstName}
                  price={request.price}
                  request={request}
                  listing={listing}
                  onDelete={onDelete}
                />
              ))
          ) : (
            <div>Loading</div>
          )}
        </>
      ) : (
        <>
          {updatedRequests ? (
            updatedRequests
              .filter((request) => request.status !== "rejected")
              .map((request) => (
                <RequestItem
                  key={request._id}
                  name={request.user.firstName}
                  price={request.price}
                  request={request}
                  listing={listing}
                />
              ))
          ) : (
            <div>Loading</div>
          )}
        </>
      )}
    </div>
  );
}

export default Requests;
