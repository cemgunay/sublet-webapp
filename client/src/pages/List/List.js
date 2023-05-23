import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

import classes from "./List.module.css";

function List() {
  const navigate = useNavigate();

  const { user: currentUser } = useContext(AuthContext);

  const goToInfo = () => {
    navigate("info");
  };

  const [listingsInProgress, setListingsInProgress] = useState([]);
  const [listingsPublished, setListingsPublished] = useState([]);
  const [visibleListings, setVisibleListings] = useState(3);
  const [showAll, setShowAll] = useState(false);

  //get and sort listings by updatedAt
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get(
          "/listings/listingsinprogress/" + currentUser._id
        );
        console.log(response.data);

        // Sort listings by updatedAt property
        const sortedListings = response.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setListingsInProgress(sortedListings);

        const responsePublished = await api.get(
          "/listings/listingspublished/" + currentUser._id
        );

        const sortedPublishedListings = responsePublished.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setListingsPublished(sortedPublishedListings);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [currentUser]);

  const handleShowAll = () => {
    setShowAll(true);
    setVisibleListings(listingsInProgress.length);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setVisibleListings(3);
  };

  function formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  const handleListingInProgressClick = async (listing) => {
    try {
      const response = await api.get("/listings/draftgroup/" + listing._id);
      const draftGroup = response.data;
      navigate(listing._id + "/" + draftGroup, { state: { listing } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleListingPublishedClick = async (listing) => {
    navigate("/host/listing/manage-your-listing/" + listing._id + "/details", { state: { listing } });
  };

  return (
    <div className={classes.container}>
      <div>Welcome back {currentUser.firstName}</div>
      <div>Check if user has published listings</div>
      <div className={classes.listinglist}>
        {listingsPublished.slice(0, visibleListings).map((listing) => (
          <div
            key={listing._id}
            className={classes.listingitem}
            onClick={() => handleListingPublishedClick(listing)}
          >
            {listing.title ? (
              listing.title
            ) : (
              <div>your listing started on {formatDate(listing.createdAt)}</div>
            )}
          </div>
        ))}
        {!showAll && listingsPublished.length > visibleListings && (
          <button onClick={handleShowAll}>Show all</button>
        )}
        {showAll && (
          <div className={classes.listinglist}>
            {listingsPublished.slice(visibleListings).map((listing) => (
              <div key={listing._id} className={classes.listingitem}>
                {listing.title ? (
                  listing.title
                ) : (
                  <div>
                    your listing started on {formatDate(listing.createdAt)}
                  </div>
                )}
              </div>
            ))}
            <button onClick={handleShowLess}>Show less</button>
          </div>
        )}
      </div>
      <div>Check if user has an unfinished listing</div>
      <div className={classes.listinglist}>
        {listingsInProgress.slice(0, visibleListings).map((listing) => (
          <div
            key={listing._id}
            className={classes.listingitem}
            onClick={() => handleListingInProgressClick(listing)}
          >
            {listing.title ? (
              listing.title
            ) : (
              <div>your listing started on {formatDate(listing.createdAt)}</div>
            )}
          </div>
        ))}
        {!showAll && listingsInProgress.length > visibleListings && (
          <button onClick={handleShowAll}>Show all</button>
        )}
        {showAll && (
          <div className={classes.listinglist}>
            {listingsInProgress.slice(visibleListings).map((listing) => (
              <div key={listing._id} className={classes.listingitem}>
                {listing.title ? (
                  listing.title
                ) : (
                  <div>
                    your listing started on {formatDate(listing.createdAt)}
                  </div>
                )}
              </div>
            ))}
            <button onClick={handleShowLess}>Show less</button>
          </div>
        )}
      </div>

      <button onClick={goToInfo}>Create a new listing</button>
    </div>
  );
}

export default List;
