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
import CurrentOffer from "../../components/Listing/CurrentOffer";

function Listing() {
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const [listing, setListing] = useState(null);
  const [isBookedByUser, setIsBookedByUser] = useState(false);
  const [booking, setBooking] = useState(null);
  const [fetchedRequest, setFetchedRequest] = useState(false);

  console.log(state);

  //if there is no state, take listing from parameters
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
  const { data, setData, handleChange, currentUserId } =
    useRequestFormContext();

  //to check if request Exists
  const [requestExists, setRequestExists] = useState(false);

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

  //check if there is already a request under this user for this listing and get the most updated one
  useEffect(() => {
    api
      .get("/requests/listing/" + id + "/" + currentUserId)
      .then((response) => {
        console.log(response.data);

        // filter the response.data to only include entries where showSubTenant is true
        const filteredData = response.data.filter(
          (item) => item.showSubTenant === true
        );

        if (filteredData.length !== 0) {
          // sort the filteredData array in descending order by the 'updatedAt' property
          const sortedData = filteredData.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );

          console.log(data);
          console.log(sortedData);

          // setData to the most recently updated entry
          setData(sortedData[0]);
          setRequestExists(true);
          setFetchedRequest(true);
        }
      })
      .catch((error) => console.error(error)).finally(setFetchedRequest(true));
  }, [id, setData, currentUserId]);

  console.log(data);

  //check if this listing has been booked by the logged in user
  useEffect(() => {
    api.get("/bookings/" + id).then((response) => {
      console.log(response.data[response.data.length - 1]);
      if (response.data.length > 0) {
        if (
          response.data[response.data.length - 1].subTenantId ===
            currentUserId ||
          response.data[response.data.length - 1].tenantId === currentUserId
        ) {
          setIsBookedByUser(true);
        } else {
          setIsBookedByUser(false);
        }
        setBooking(response.data[response.data.length - 1]);
        api
          .get(
            "/requests/" +
              response.data[response.data.length - 1].acceptedRequestId
          )
          .then((response) => {
            if (
              response.data.subTenantId === currentUserId ||
              response.data.tenantId === currentUserId
            ) {
              console.log(response);
              setData(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setBooking(null);
      }
    });
  }, [id, setData]);

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
    navigate(-1);
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

      {fetchedRequest && listing ? (
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
            {!requestExists ? null : (
              <CurrentOffer
                data={data}
                listing={listing}
                isBooked={isBookedByUser}
                booking={booking}
              />
            )}
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
              <div>Move In Date: {data.startDate}</div>
              <div>Move Out Date: {data.endDate}</div>
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
              requestExists={requestExists}
              isBooked={isBookedByUser}
              booking={booking}
            />
          </div>
        </div>
      ) : (
        <div>LOADING</div>
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
