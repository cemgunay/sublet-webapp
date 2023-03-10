import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import classes from "./Listing.module.css";
import Carousel from "../../components/Carousel/Carousel";
import Scroll from "../../components/Scroll/Scroll";
import Utilities from "../../components/Listing/Utilities";
import Amenities from "../../components/Listing/Amenities";
import Modal from "../../components/Modal/Modal";

import Collage from "../../components/Collage/Collage";

import CalendarComponent from "../../components/Listing/CalendarComponent";
import BottomBar from "../../components/BottomBar/BottomBar";

function Listing() {
  
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  //const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const listing = state.listing;

  //for back button
  const navigate = useNavigate();

  const [user, setUser] = useState([]);

  const [dates, setDates] = useState([new Date(), new Date()]);

  useEffect(() => {
    axios
      .get("/dummy/dummy-data-users.json")
      .then((response) => {
        setUser(response.data[listing.userid - 1]);
      })
      .catch((error) => console.log(error));
  }, [listing.userid]);

  const [openModal, setOpenModal] = useState(false)

  const handleClick = () => {
    setOpenModal(!openModal)
  }

  const goBack = () => {
    navigate('/')
  }

  return (
    <>
    <div className={classes.back} onClick={goBack}>
    <FontAwesomeIcon icon={faCircleChevronLeft} inverse/>
    </div>
      <div className={!openModal ? classes.container : classes.containerNoScroll}>
        {openModal && <Modal closeModal={setOpenModal} images={listing.image}/>}
        <Carousel images={listing.image} onClick={handleClick} index={0} dots={true} from={'Listing'}/>
        <div className={classes.content}>
          <div className={classes.title}>
            <div className={classes.first}>
              <h3>{listing.title}</h3>
              <p>{listing.days_left}</p>
            </div>
            <address>{listing.address}</address>
            <div>
              <p>{listing.views}</p>
            </div>
          </div>
          <div className={classes.bio}>
            Entire Suite Subletted by {user.firstname}
            <div className={classes.details}>
              <p>
                {listing.bedrooms.length} bedrooms - {listing.beds} beds -{" "}
                {listing.bathrooms} bathrooms
              </p>
            </div>
          </div>
          {listing.availabletoview && (
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
            <Scroll bedrooms={listing.bedrooms}/>
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
            <p>
              This will be a map with a marker
            </p>
          </div>
          <div className={classes.availability}>
            <h2>Availability</h2>
            <CalendarComponent dates={dates} setDates={setDates}/>
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
      </div>
      <div>
        <BottomBar listing={listing} dates={dates}/>
      </div>
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
