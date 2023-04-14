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

  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(3);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get(
          "/listings/listingsinprogress/" + currentUser._id
        );
        console.log(response);
        setListings(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
  }, [currentUser]);

  const handleShowAll = () => {
    setShowAll(true);
    setVisibleListings(listings.length);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setVisibleListings(3);
  };

  function formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  return (
    <div className={classes.container}>
      <div>Welcome back {currentUser.firstName}</div>
      <div>Check if user has an unfinished listing</div>
      <div className={classes.listinglist}>
        {listings.slice(0, visibleListings).map((listing) => (
          <div key={listing._id} className={classes.listingitem}>
            {listing.title ? (
              listing.title
            ) : (
              <div>your listing started on {formatDate(listing.createdAt)}</div>
            )}
          </div>
        ))}
        {!showAll && listings.length > visibleListings && (
          <button onClick={handleShowAll}>Show all</button>
        )}
        {showAll && (
          <div className={classes.listinglist}>
            {listings.slice(visibleListings).map((listing) => (
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
