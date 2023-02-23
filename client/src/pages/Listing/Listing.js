import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import classes from "./Listing.module.css";
import Carousel from "../../components/Carousel/Carousel";

function Listing() {

  //const { id } = useParams();

  const location = useLocation();
  const { state } = location;
  const listing = state.listing;

  const [user, setUser] = useState([])

  useEffect(() => {
    axios
      .get("/dummy/dummy-data-users.json")
      .then((response) => {
        setUser(response.data[listing.userid - 1])
      })
      .catch((error) => console.log(error));
  }, [listing.userid]);

  console.log(listing)
  console.log(user)

  return (
    <div className={classes.container}>
      <Carousel images={listing.image} />
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
              {listing.bedrooms} bedrooms - {listing.beds} beds - {" "}
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
          <p>{listing.description > 250 ? listing.description.substring(0,250).listing + '...'  : listing.description }</p>
        </div>
        <div className={classes.bedrooms}>
          Bedrooms
          <p>Will use/create lil card component that i can pass the bedroom images as children props</p>
        </div>
        <div>
          Utilities Included
        </div>
        <div>
          What this place offers
        </div>
        <div>
          Location
        </div>
        <div>
          Availability
        </div>
        <div>
          Health & Safety
          <p>SOME GIBBERISH THIS WILL PROBS BE A COMPONENTTTTTTTTTTTT I DONT WANNA REWRITE THIS SHIT EVERYTIME</p>
        </div>
        <div>
          Sublet Policy
          <p>SOME GIBBERISH THIS WILL PROBS BE A COMPONENTTTTTTTTTTTT I DONT WANNA REWRITE THIS SHIT EVERYTIME</p>
        </div>
        <div>
          Report this listing
          <p>SOME GIBBERISH THIS WILL PROBS BE A COMPONENTTTTTTTTTTTT I DONT WANNA REWRITE THIS SHIT EVERYTIME</p>
        </div>
      </div>
    </div>
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