import { faCircleChevronLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import api from "../../api/axios";
import Carousel from '../../components/Carousel/Carousel';
import Amenities from '../../components/Listing/Amenities';
import BottomBar from '../../components/ManageListing/BottomBar';
import Utilities from '../../components/Listing/Utilities';
import Modal from '../../components/Modal/Modal';
import Scroll from '../../components/Scroll/Scroll';
import LocationMarker from '../../components/Util/LocationMarker';
import MonthGrid from '../../components/Util/MonthGrid';

import classes from './Preview.module.css'

function Preview() {
    const { id } = useParams()
    const location = useLocation()
    const { state } = location;
    const [listing, setListing] = useState(null)
  
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

    //for back button
  const navigate = useNavigate()

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
    navigate(-1);
  };

  const images = listing?.images?.map(({ url }) => url) || [];

  const formattedAddress = listing
    ? `${listing.location.address1}, ${listing.location.city}, ${listing.location.stateprovince}`
    : "";

  const beds = listing?.basics?.bedrooms?.map(({ bedType }) => bedType) || [];

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
              {getMonth(listing.moveInDate)} -{getMonth(listing.moveOutDate)}
              <div>
                Move In Date: {listing.moveInDate}
              </div>
              <div>
                Move Out Date: {listing.moveOutDate}
              </div>
              <MonthGrid
                defaultMoveInDate={listing.moveInDate}
                defaultMoveOutDate={listing.moveOutDate}
                moveInDate={listing.moveInDate}
                moveOutDate={listing.moveOutDate}
                shorterStays={false}
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
            listing={listing}/>
          </div>
        </div>
      )}
    </>
  );
}

export default Preview