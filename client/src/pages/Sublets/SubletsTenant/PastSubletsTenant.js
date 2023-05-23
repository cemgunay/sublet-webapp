import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../api/axios";
import ListingList from "../../../components/Util/Listings/ListingList";

function PastSubletsTenant() {
  const { user: currentUser } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

 //to fetch all expired listings
 useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsResponse = await api.get(
          "/listings/listingsexpired/" + currentUser._id
        );
        console.log(listingsResponse.data);
        setListings(listingsResponse.data);

        const requestPromises = listingsResponse.data.map((listing) =>
          api.get("/requests/listing/" + listing._id)
        );

        const requestsResponse = await Promise.all(requestPromises);

        console.log(requestPromises);

        setRequests(requestsResponse.flatMap((response) => response.data));

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [currentUser]);

  return (
    <div>
      <p>{requests.length} past subLets</p>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList requests={requests} listings={listings} mode="SubletsTenant"/>
        )}
      </div>
    </div>
  );
}
export default PastSubletsTenant;
