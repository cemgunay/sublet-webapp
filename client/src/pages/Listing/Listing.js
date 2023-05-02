import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

import api from "../../api/axios";

import classes from "./Listing.module.css";
import Carousel from "../../components/Carousel/Carousel";
import Scroll from "../../components/Scroll/Scroll";
import Utilities from "../../components/Listing/Utilities";
import Amenities from "../../components/Listing/Amenities";
import Modal from "../../components/Modal/Modal";

import BottomBar from "../../components/Listing/BottomBar/BottomBar";
import MonthGrid from "../../components/Util/MonthGrid";
import LocationMarker from "../../components/Util/LocationMarker";
import useRequestFormContext from "../../hooks/useRequestFormContext";

function Listing() {
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const [listing, setListing] = useState(null);

  //if there is no state, take from parameters
  useEffect(() => {
    if (!state || !state.listing) {
      api.get("/listings/" + id).then((response) => {
        setListing(response.data);
      });
    } else {
      setListing(state.listing);
    }
  }, [id, state]);

  //get data object and handlechange from context
  const { data, setData, handleChange } = useRequestFormContext();

  //to set the data object with its id
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      listingId: id,
    }));
  }, [id, setData]);

  //to set the data object with its tenantId

  const userId = listing?.userId;

  useEffect(() => {
    if (listing) {
      setData((prevData) => ({
        ...prevData,
        tenantId: userId,
      }));
    }
  }, [userId, setData, listing]);

  //for back button
  const navigate = useNavigate();

  //to set the user
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (listing) {
      api
        .get("/users/id/" + listing.userId)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [listing]);

  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(!openModal);
  };

  const goBack = () => {
    navigate("/");
  };

  const images = listing?.images?.map(({ url }) => url) || [];

  const formattedAddress = listing
    ? `${listing.location.address1}, ${listing.location.city}, ${listing.location.stateprovince}`
    : "";

  const beds = listing?.basics?.bedrooms?.map(({ bedType }) => bedType) || [];

  const handleDataChange = useCallback(
    ({ startDate, endDate }) => {
      setData((prevData) => ({
        ...prevData,
        startDate: startDate,
        endDate: endDate,
      }));
    },
    [setData]
  );

  const getMonth = (date) => {
    const dateToChange = new Date(date);
    const options = { month: "short", year: "numeric" };
    const monthYearString = dateToChange.toLocaleDateString("en-US", options);
    return monthYearString;
  };

  console.log(listing);

  return (
    <>
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
            </div>
            <div className={classes.bio}>
              Entire Suite Subletted by {user.firstName}
              <div className={classes.details}>
                <p>
                  {listing.basics.bedrooms.length} bedrooms - {beds.length} beds
                  - {listing.basics.bathrooms} bathrooms
                </p>
              </div>
            </div>
            {listing.availableToView && (
              <div className={classes.traits}>
                <FontAwesomeIcon icon={faEye} />
                <p> Available for viewing</p>
              </div>
            )}
            <div className={classes.about}>
              <p>
                {listing.description > 250
                  ? listing.description.substring(0, 250).listing + "..."
                  : listing.description}
              </p>
            </div>
            <div className={classes.bedrooms}>
              <h2>Bedrooms</h2>
              <Scroll bedrooms={listing.basics.bedrooms} />
            </div>
            <div className={classes.utilities}>
              <h2>Utilities</h2>
              <Utilities listing={listing} />
            </div>
            <div className={classes.amenities}>
              <h2>What this place offers</h2>
              <Amenities listing={listing} />
            </div>
            <div className={classes.location}>
              <h2>Location</h2>
              <LocationMarker
                lat={listing.location.lat}
                lng={listing.location.lng}
              />
            </div>
            <div className={classes.availability}>
              <h2>Availability</h2>
              {!listing.shorterStays ? null : (
                <div>Shorter stays available</div>
              )}
              {getMonth(data.startDate)} -{getMonth(data.endDate)}
              <MonthGrid
                defaultMoveInDate={listing.moveInDate}
                defaultMoveOutDate={listing.moveOutDate}
                moveInDate={listing.moveInDate}
                moveOutDate={listing.moveOutDate}
                shorterStays={listing.shorterStays}
                onDataChange={handleDataChange}
              />
            </div>
            <div>
              Health & Safety
              <p>
                SOME GIBBERISH THIS WILL PROBS BE A COMPONENTTTTTTTTTTTT I DONT
                WANNA REWRITE THIS SHIT EVERYTIME
              </p>
            </div>
            <div>
              Sublet Policy
              <p>
                SOME GIBBERISH THIS WILL PROBS BE A COMPONENTTTTTTTTTTTT I DONT
                WANNA REWRITE THIS SHIT EVERYTIME
              </p>
            </div>
            <div>
              Report this listing
              <p>
                SOME GIBBERISH THIS WILL PROBS BE A COMPONENTTTTTTTTTTTT I DONT
                WANNA REWRITE THIS SHIT EVERYTIME
              </p>
            </div>
          </div>
          <div>
            <BottomBar
              listing={listing}
              data={data}
              setData={setData}
              handleChange={handleChange}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Listing;

//const [listing, setListing] = useState([]);

//setListing(location.state)

/*

  useEffect(() => {
    fetch("/dummy/dummy-data.json")
      .then(response => response.json())
      .then(json => setListing(json))
      console.log(listing)
    }, [id]);

    */

//this is where there would be an axios.get('/listing/${id}').then(response => setListing(response.data)
//setListing(dummydata.find((listing) => listing.id === id));

//if (!listing) return "";
