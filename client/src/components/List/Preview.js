import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

import Carousel from "../../components/Carousel/Carousel";
import Scroll from "../../components/Scroll/Scroll";
import Utilities from "../../components/Listing/Utilities";
import Amenities from "../../components/Listing/Amenities";
import Modal from "../../components/Modal/Modal";

import classes from "./Preview.module.css";
import LocationMarker from "../Util/LocationMarker";

function Preview(props) {
  const navigate = useNavigate();

  const [dates, setDates] = useState([new Date(), new Date()]);

  const goBack = () => {
    props.setSeePreview(false);
  };

  const images = props.data.images.map(({ url }) => url);

  const beds = props.data.basics.bedrooms.map(({ bedType }) => bedType);

  console.log(props.data.basics.bedrooms);

  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(!openModal);
  };
  
  const formattedAddress =
      props.data.location.address1 +
      ", " +
      props.data.location.city +
      ", " +
      props.data.location.stateprovince;

  console.log(props.data);

  return (
    <div className={`${classes.container} ${openModal ? classes.noScroll : ''}`}>
      <div className={classes.headercontainer}>
        <div className={classes.header}>
          <div className={classes.back} onClick={goBack}>
            <FontAwesomeIcon icon={faCircleChevronLeft} />
          </div>
          <div className={classes.previewtitle}>Full Preview</div>
        </div>
      </div>

      <div className={!openModal ? classes.containerscroll : classes.containerNoScroll}>
        {openModal && <Modal closeModal={setOpenModal} images={images} />}
        <Carousel
          images={images}
          onClick={handleClick}
          index={0}
          dots={true}
          from={"Listing"}
        />
        <div className={classes.content}>
          <div className={classes.title}>
            <div className={classes.first}>
              <h3>{props.data.title}</h3>
              <p>6 days left</p>
            </div>
            <address>{formattedAddress}</address>
            <div>
              <p>{props.data.views}</p>
            </div>
          </div>
          <div className={classes.bio}>
            Entire Suite Subletted by {props.currentUser.firstName}
            <div className={classes.details}>
              <p>
                {props.data.basics.bedrooms.length} bedrooms - {beds.length}{" "}
                beds - {props.data.basics.bathrooms} bathrooms
              </p>
            </div>
          </div>
          {props.data.availableToView && (
            <div className={classes.traits}>
              <FontAwesomeIcon icon={faEye} />
              <p> Available for viewing</p>
            </div>
          )}
          <div className={classes.about}>
            <p>
              {props.data.description > 250
                ? props.data.description.substring(0, 250).props.data + "..."
                : props.data.description}
            </p>
          </div>
          <div className={classes.bedrooms}>
            <h2>Bedrooms</h2>
            <Scroll bedrooms={props.data.basics.bedrooms} />
          </div>
          <div className={classes.utilities}>
            <h2>Utilities</h2>
            <Utilities listing={props.data} />
          </div>
          <div className={classes.amenities}>
            <h2>What this place offers</h2>
            <Amenities listing={props.data} />
          </div>
          <div className={classes.location}>
            <h2>Location</h2>
            <LocationMarker lat={props.data.location.lat} lng={props.data.location.lng}/>
          </div>
          <div className={classes.availability}>
            <h2>Availability</h2>
            {((!props.moveOutExists || !props.data.moveOutDate) || (!props.moveInExists || !props.data.moveInDate)) ? null : (
              <div>
                {props.data.moveInDate.$d.toLocaleDateString("en-US", props.options)} - {props.data.moveOutDate.$d.toLocaleDateString("en-US", props.options)}
              </div>
            )}
            {props.data.shorterStays ? <div>Available for shorter sublets</div> : <div>Not available for shorter sublets</div>}
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
      <div></div>
    </div>
  );
}

export default Preview;
