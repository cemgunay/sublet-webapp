import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import BottomNav from "../../components/BottomNav/BottomNav";
import { AuthContext } from "../../context/AuthContext";

import classes from "./List.module.css";

function List() {
  const navigate = useNavigate();

  const { user: currentUser } = useContext(AuthContext);

  //for modal
  const [openDialog, setOpenDialog] = useState(false);

  const goToInfo = () => {
    navigate("info");
  };

  const goToOverview = () => {
    navigate("overview");
  };

  const [listingsInProgress, setListingsInProgress] = useState([]);
  const [listingsPublished, setListingsPublished] = useState([]);

  const [visibleListingsInProgress, setVisibleListingsInProgress] = useState(3);
  const [visibleListingsCompleted, setVisibleListingsCompleted] = useState(3);

  const [showAllInProgress, setShowAllInProgress] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const [bookedListings, setBookedListings] = useState([]);

  const fetchBookedListings = async () => {
    try {
      const response = await api.get(
        "/listings/listingsbooked/" + currentUser._id
      );
      setBookedListings(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  //get and sort listings by updatedAt
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
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
          "/listings/listingscompleted/" + currentUser._id
        );

        const sortedPublishedListings = responsePublished.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setListingsPublished(sortedPublishedListings);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
    fetchBookedListings();
  }, [currentUser]);

  const handleShowAll = (type) => {
    if (type === "completed") {
      setShowAllCompleted(true);
      setVisibleListingsCompleted(listingsPublished.length);
    } else {
      setShowAllInProgress(true);
      setVisibleListingsInProgress(listingsInProgress.length);
    }
  };

  const handleShowLess = (type) => {
    if (type === "completed") {
      setShowAllCompleted(false);
      setVisibleListingsCompleted(3);
    } else {
      setShowAllInProgress(false);
      setVisibleListingsInProgress(3);
    }
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
    navigate("/host/listing/manage-your-listing/" + listing._id + "/details", {
      state: { listing },
    });
  };

  const handleListingBookedClick = async (listing) => {
    navigate("/host/listing/" + listing._id, {
      state: { listing },
    });
  };

  const handleDelete = async (listing) => {};

  return (
    <>
      <div className={classes.container}>
        <div className={classes.headercontainer}>
          <h3>
            {listingsInProgress.length + listingsPublished.length} listings
          </h3>
          <div onClick={goToOverview} className={classes.createnewcontainer}>
            <div>Create new listing</div>
            <FontAwesomeIcon icon={faPlusSquare} size={"lg"} />
          </div>
        </div>
        {isLoading ? (
          <div>loading</div>
        ) : listingsInProgress.length === 0 &&
          listingsPublished.length === 0 ? (
          <div>Create a new listing</div>
        ) : (
          <>
            <div className={classes.listinglistcontainer}>
              <h3 className={classes.title}>Completed listings</h3>
              <div className={classes.listinglist}>
                {listingsPublished
                  .slice(0, visibleListingsCompleted)
                  .map((listing) => (
                    <div
                      key={listing._id}
                      className={classes.listingitemcontainer}
                      onClick={() => handleListingPublishedClick(listing)}
                    >
                      <div className={classes.listingitem}>
                        <div className={classes.imagecontainer}>
                          {listing.images.length > 0 ? (
                            <img src={listing.images[0].url} />
                          ) : (
                            <img src="/images/logo192.png" />
                          )}
                        </div>
                        <div>
                          {listing.title ? (
                            listing.title
                          ) : (
                            <div>
                              your listing started on{" "}
                              {formatDate(listing.createdAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          listing.published
                            ? classes.listingpublished
                            : classes.listingnotpublished
                        }
                      >
                        ●
                      </div>
                    </div>
                  ))}
                {!showAllCompleted &&
                listingsPublished.length > visibleListingsCompleted ? (
                  <div onClick={() => handleShowAll("completed")}>Show all</div>
                ) : listingsPublished.length > 3 ? (
                  <div onClick={() => handleShowLess("completed")}>
                    Show less
                  </div>
                ) : null}
              </div>
            </div>
            {bookedListings.length > 0 ? (
              <div className={classes.listinglistcontainer}>
                <h3 className={classes.title}>Booked Listings</h3>
                <div className={classes.listinglist}>
                  {bookedListings.map((listing) => (
                    <div
                      key={listing._id}
                      className={classes.listingitemcontainer}
                      onClick={() => handleListingBookedClick(listing)}
                    >
                      <div className={classes.listingitem}>
                        <div className={classes.imagecontainer}>
                          {listing.images.length > 0 ? (
                            <img src={listing.images[0].url} />
                          ) : (
                            <img src="/images/logo192.png" />
                          )}
                        </div>
                        <div>
                          {listing.title ? (
                            listing.title
                          ) : (
                            <div>
                              your listing started on{" "}
                              {formatDate(listing.createdAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={classes.listinglistcontainer}>
              <h3 className={classes.title}>In progress listings</h3>
              <div className={classes.listinglist}>
                {listingsInProgress
                  .slice(0, visibleListingsInProgress)
                  .map((listing) => (
                    <div
                      key={listing._id}
                      className={classes.listingitemcontainer}
                    >
                      <div className={classes.listingitem}>
                        <div
                          className={classes.imagecontainer}
                          onClick={() => handleListingInProgressClick(listing)}
                        >
                          {listing.images.length > 0 ? (
                            <img src={listing.images[0].url} />
                          ) : (
                            <img src="/images/logo192.png" />
                          )}
                        </div>
                        <div>
                          {listing.title ? (
                            listing.title
                          ) : (
                            <div>
                              your listing started on{" "}
                              {formatDate(listing.createdAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={classes.righticon}>
                        <FontAwesomeIcon
                          onClick={() => setOpenDialog(true)}
                          icon={faTrash}
                        />
                      </div>
                      <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Confirm Delete"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to permanently delete this
                            listing?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenDialog(false)}
                            color="secondary"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              handleDelete(listing);
                              setOpenDialog(false);
                            }}
                            color="primary"
                            autoFocus
                          >
                            Continue
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  ))}
                {!showAllInProgress &&
                listingsInProgress.length > visibleListingsInProgress ? (
                  <div onClick={handleShowAll}>Show all</div>
                ) : listingsInProgress.length > 3 ? (
                  <div onClick={handleShowLess}>Show less</div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}

export default List;
