import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import classes from "./Sublet.module.css";

import api from "../../api/axios";
import Modal from "../../components/Modal/Modal";
import Carousel from "../../components/Carousel/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Requests from "../../components/Sublet/Requests";

import { toast } from "react-toastify";

function Sublet() {
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const [listing, setListing] = useState(null);
  const [requests, setRequests] = useState([]);

  //if there is no state, take listing from parameters and DB
  useEffect(() => {
    if (!state || !state.listing) {
      api.get("/listings/" + id).then((response) => {
        setListing(response.data);
      });
    } else {
      setListing(state.listing);
    }
  }, [id, state]);

  //if there is no state, take requests from parameters and DB
  useEffect(() => {
    if (!state || !state.requests) {
      api.get("/requests/listing/" + id).then((response) => {
        setRequests(response.data);
      });
    } else {
      setRequests(state.requests);
    }
  }, [id, state]);

  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(!openModal);
  };

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const images = listing?.images?.map(({ url }) => url) || [];

  const formattedAddress = listing
    ? `${listing.location.address1}, ${listing.location.city}, ${listing.location.stateprovince}`
    : "";

  //This is for deleting past requests
  const handleDeleteConfirm = (requestToDelete) => {
    // call your delete API here

    const updateRequest = {
      showTenant: false,
    };

    api
      .put("/requests/update/" + requestToDelete, updateRequest)
      .then((response) => {
        console.log(response.data);
        const updatedRequests = requests.filter(
          (request) => request._id !== requestToDelete
        );
        setRequests(updatedRequests);
        toast.success("Past request deleted successfully");
        navigate("/sublets/past");
      })
      .catch((error) => {
        toast.error("Failed to delete past request: " + error.message);
        console.error(error);
      });
  };

  return (
    <div>
      <div className={classes.back} onClick={goBack}>
        <FontAwesomeIcon icon={faCircleChevronLeft} inverse />
      </div>
      {!listing ? (
        <div>HOLDUP</div>
      ) : (
        <div
          className={!openModal ? classes.container : classes.containerNoScroll}
        >
          {openModal && <Modal closeModal={setOpenModal} images={images} />}
          <div className={classes.carouselcontainer}>
            <Carousel
              images={images}
              onClick={handleClick}
              index={0}
              dots={true}
              from={"Listing"}
            />
          </div>

          <div className={classes.content}>
            <div className={classes.title}>
              <div className={classes.first}>
                <h3>{listing.title}</h3>
                <p>{listing.days_left}</p>
              </div>
              <address>{formattedAddress}</address>
              <div>
                <p>{listing.views}</p>
              </div>
              <div>
                Listed for:
                <p>{listing.price}</p>
              </div>
            </div>
            <div className={classes.requestscontainer}>
              <Requests
                requests={requests}
                listing={listing}
                onDelete={handleDeleteConfirm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sublet;
