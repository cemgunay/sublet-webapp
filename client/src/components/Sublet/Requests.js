import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import RequestItem from "./RequestItem";

function Requests({ requests, listing }) {
  console.log(requests);
  console.log(listing)

  const [names, setNames] = useState([]);

  useEffect(() => {
    const fetchName = async (subTenantId) => {
      try {
        const response = await api.get("/users/id/" + subTenantId);
        const nameData = await response.data;
        return nameData.firstName;
      } catch (error) {
        console.error(error);
        return "Error fetching name";
      }
    };

    const loadNames = async () => {
      const newNames = await Promise.all(
        requests.map(({ subTenantId }) => fetchName(subTenantId))
      );
      setNames(newNames);
    };

    loadNames();
  }, [requests]);

  return (
    <div>
      <h2>Request List</h2>
      <div>
        {names.length > 0 ? (
          requests.map((request, index) => (
            <RequestItem
              key={request._id}
              name={names[index]}
              price={request.price}
              request={request}
              listing={listing}
            />
          ))
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
}

export default Requests;
