import React, { useState, useEffect } from "react";
import BottomNav from "../../../components/BottomNav/BottomNav";
import useAuth from "../../../hooks/useAuth";

import api from "../../../api/axios";

import classes from "./SubletsTenant.module.css";
import ListingList from "../../../components/Util/Listings/ListingList";

function SubletsTenant() {
  //this is shortcut for useContext(AuthContext);
  const { user: currentUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsResponse = await api.get(
          "/listings/listingspublished/" + currentUser._id
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
    <div className={classes.container}>
      <div>
        My SubLets
      </div>
      <div>
        {loading ? (
          <div>loading</div>
        ) : (
          <ListingList requests={requests} listings={listings} mode="SubletsTenant"/>
        )}
      </div>
      <footer className={classes.footer}>
        <BottomNav />
      </footer>
    </div>
  );
}

export default SubletsTenant;
