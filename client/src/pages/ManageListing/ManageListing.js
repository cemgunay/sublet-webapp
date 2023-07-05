import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import classes from "./ManageListing.module.css";

import api from "../../api/axios";
import Carousel from "../../components/Carousel/Carousel";
import useAuth from "../../hooks/useAuth";

import { toast } from "react-toastify";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import FormInputField from "../../components/Util/FormInputField";
import FormDropdownField from "../../components/Util/FormDropdownField";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers";

import { useJsApiLoader } from "@react-google-maps/api";
import IncrementalInputField from "../../components/Util/IncrementalInputField";
import BedroomList from "../../components/List/BedroomList";
import ScrollUpModal from "../../components/UI/ScrollUpModal";
import Photos from "../../components/ManageListing/Photos";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../../components/BottomNav/BottomNav";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Tooltip } from "react-tooltip";

//for the useJsApiLoader
const libraries = ["places"];

function ManageListing() {
  //get current user
  const { user: currentUser } = useAuth();

  //for modal
  const [openDialog, setOpenDialog] = useState(false);

  //to check if there is an accept workflow in progress
  const [isAnyRequestActive, setIsAnyRequestActive] = useState(false);

  //for navigation
  const navigate = useNavigate();

  //for listing
  const [listing, setListing] = useState(null);

  //for editing
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");

  //to handle loading
  const [isLoading, setIsLoading] = useState(null);

  // to handle editing amenities
  const [editAmenities, setEditAmenities] = useState(null);

  // to handle editing location
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // aboutyourplace options DO NOT CHANGE ORDER IT IS INDEXED IN THIS ORDER
  const propertyDisplayOptions = ["House", "Apartment", "Dorm", "Townhouse"];
  const propertyValueOptions = ["house", "apartment", "dorm", "townhouse"];
  const privacyDisplayOptions = ["Entire place", "Private room", "Shared room"];
  const privacyValueOptions = ["entire", "private", "shared"];

  //for editing dates
  const [dates, setDates] = useState({
    moveInDate: listing?.moveInDate ? dayjs(listing.moveInDate) : null,
    moveOutDate: listing?.moveOutDate ? dayjs(listing.moveOutDate) : null,
  });

  useEffect(() => {
    if (listing) {
      setDates({
        moveInDate: dayjs(listing.moveInDate),
        moveOutDate: dayjs(listing.moveOutDate),
      });
    }
  }, [listing]);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Initialize editBedrooms to an empty object or sensible defaults.
  const [editBasics, setEditBasics] = useState({
    basics: { bedrooms: [], bathrooms: 0 },
  });

  useEffect(() => {
    // Once listing is available, update editBasics.

    if (listing && listing.basics) {
      console.log("hola");
      setEditBasics({ basics: { ...listing.basics } });
    }
  }, [listing]);

  // location form input changes
  const [locationForm, setLocationForm] = useState(
    listing ? listing.location : null
  );

  //to set above const
  useEffect(() => {
    if (listing && listing.location) {
      setLocationForm(listing.location);
    }
  }, [listing]);

  //load google maps api
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  //for incorrect address logic
  const [forceSave, setForceSave] = useState(false);
  const [incorrectAddress, setIncorrectAddress] = useState(false);
  const [partialAddress, setPartialAddress] = useState(null);

  //for amenities to be displayed as a list
  let amenities = [];
  if (listing && listing.amenities) {
    amenities = Object.keys(listing.amenities).filter(
      (key) => listing.amenities[key]
    );
  }

  //for toggling modal
  const [openPhotos, setOpenPhotos] = useState(false);

  //for listing id from parameters
  const { id } = useParams();

  //to format address
  const formattedAddress = listing
    ? `${listing.location.address1}, ${listing.location.city}, ${listing.location.stateprovince}`
    : "";

  //for images
  const [images, setImages] = useState(null);

  useEffect(() => {
    if (listing) {
      setImages(listing.images);
    }
  }, [listing]);

  //set listing and check if it has active request
  useEffect(() => {
    api
      .get("/listings/" + id)
      .then((response) => {
        setListing(response.data);
        // After setting the listing, fetch the requests for this listing
        return api.get("/requests/listing/" + response.data._id);
      })
      .then((response) => {
        console.log(response.data);
        // Check the status of each request
        const activeRequestExists = response.data.some(
          (request) =>
            request.status === "pendingSubTenantUpload" ||
            request.status === "pendingTenantUpload" ||
            request.status === "pendingFinalAccept"
        );
        setIsAnyRequestActive(activeRequestExists);
      })
      .catch((error) => console.log(error));
  }, [id]);

  //for opening preview
  const handlePreviewClick = (listing) => {
    navigate("/host/listing/manage-your-listing/" + id + "/preview", {
      state: { listing },
    });
  };

  //next four all for handling edit and submiting it
  const handleEditClick = (field, currentValue) => {
    if (field === "price") {
      setEditValue({ price: currentValue });
    } else {
      setEditValue(currentValue);
    }
    setEditingField(field);
  };

  const handleEditChange = (e) => {
    if (editingField === "aboutyourplace") {
      setEditValue({
        ...editValue,
        [e.target.name]: e.target.value,
      });
    } else if (typeof editValue === "boolean") {
      setEditValue(e.target.checked);
    } else if (editingField === "price") {
      let value = e.target.value;
      let newValue = value.replace(/\$/g, ""); // Removing the "$" symbol using replace()
      setEditValue({ price: newValue });
    } else {
      setEditValue(e.target.value);
    }
  };

  // This function will be called when an amenity is clicked
  const toggleAmenity = (amenity) => {
    setEditAmenities((prev) => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  };

  const handleEditSubmit = (field, updatedValue, rejectAllRequests = false) => {
    console.log(updatedValue);
    if (field === "location" && !forceSave) {
      setIsLoading(field);
      if (!validateLocationForm(updatedValue)) {
        setIsLoading(null);
        return;
      } else {
        const formattedAddress =
          updatedValue.address1 +
          ", " +
          updatedValue.city +
          ", " +
          updatedValue.stateprovince +
          " " +
          updatedValue.postalcode +
          ", " +
          updatedValue.countryregion;

        console.log(formattedAddress);

        let geocoder = new window.google.maps.Geocoder();

        geocoder.geocode(
          { address: formattedAddress },
          function handleResults(results, status) {
            if (status === "OK") {
              const place = results[0];

              console.log(place);

              // check if there is a partial match
              if (place.partial_match) {
                setIncorrectAddress(true);
                setPartialAddress(place.formatted_address);
              } else {
                setIncorrectAddress(false);
                // if address is valid, proceed with the update
                performListingUpdate(field, updatedValue);
              }
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
        );
        setIsLoading(null);
      }
    } else if (field === "published" && rejectAllRequests) {
      if (updatedValue === "delete") {
        api
          .put("/listings/soft-delete/" + id + "/" + currentUser._id)
          .then((response) => {
            console.log(response);
            api
              .post("/requests/rejectAll/" + id)
              .then((response) => {
                console.log(response);
                performListingUpdate(field, false);
                navigate('/host/list')
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        api
          .post("/requests/rejectAll/" + id)
          .then((response) => {
            console.log(response);
            performListingUpdate(field, updatedValue);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      performListingUpdate(field, updatedValue);
    }
  };

  const performListingUpdate = (field, updatedValue) => {
    setIsLoading(field);
    console.log(field);
    console.log(updatedValue);
    if (field === "dates") {
      api
        .put("/listings/" + id, {
          moveInDate: updatedValue.moveInDate,
          moveOutDate: updatedValue.moveOutDate,
          userId: currentUser._id,
        })
        .then((response) => {
          setListing(response.data.updatedListing);
          setEditingField("");
          setIsEditingLocation("");
          setEditValue("");
          toast.success("Update successful!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Update failed! Please try again.");
        })
        .finally(() => {
          setIsLoading(null);
          // reset forceSave after the operation
          setForceSave(false);
        });
    } else {
      api
        .put("/listings/" + id, {
          [field]: updatedValue,
          userId: currentUser._id,
        })
        .then((response) => {
          setListing(response.data.updatedListing);
          setEditingField("");
          setIsEditingLocation("");
          setEditValue("");
          setIncorrectAddress(false);
          setPartialAddress(null);
          toast.success("Update successful!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Update failed! Please try again.");
        })
        .finally(() => {
          setIsLoading(null);
          // reset forceSave after the operation
          setForceSave(false);
        });
    }
  };

  // For location change
  const handleChange = (e) => {
    setIncorrectAddress(false);
    setLocationForm({
      ...locationForm,
      [e.target.name]: e.target.value,
    });
  };

  const validateLocationForm = (locationData) => {
    const requiredFields = [
      "address1",
      "city",
      "stateprovince",
      "postalcode",
      "countryregion",
    ];
    for (let field of requiredFields) {
      if (!locationData[field]) {
        alert(`Please fill in the ${field} field.`);
        return false;
      }
    }

    // Validate the postal code or zip code using the regex pattern
    const postalOrZipCodeRegex =
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d|^\d{5}(?:[-\s]\d{4})?$/;
    if (!postalOrZipCodeRegex.test(locationData.postalcode)) {
      alert("Invalid postal code or zip code!");
      return false;
    }

    return true;
  };

  //handle move in date change
  const handleOnChangeMoveIn = (newValue) => {
    console.log(newValue);

    setDates((prevData) => ({
      ...prevData,
      moveInDate: newValue,
    }));
  };

  //handle move out date change
  const handleOnChangeMoveOut = (newValue) => {
    setDates((prevData) => ({
      ...prevData,
      moveOutDate: newValue,
    }));
  };

  //different way of rendering (using it for basics editing)
  let contentBasics;
  let contentPrice;
  if (isLoading === "basics") {
    contentBasics = <LoadingSpinner />;
  } else if (editingField === "basics") {
    if (listing && listing.basics && editBasics) {
      contentBasics = (
        <div>
          <IncrementalInputField
            data={editBasics}
            setData={setEditBasics}
            type="bedrooms"
          />
          <IncrementalInputField
            data={editBasics}
            setData={setEditBasics}
            type="bathrooms"
          />
          <BedroomList data={editBasics} setData={setEditBasics} />
          <button
            disabled={editBasics.basics.bedrooms.length < 1}
            onClick={() => handleEditSubmit("basics", editBasics.basics)}
          >
            Save
          </button>
          <button onClick={() => setEditingField("")}>Cancel</button>
        </div>
      );
    } else {
      contentBasics = <LoadingSpinner />;
    }
  } else if (listing) {
    contentBasics = (
      <>
        <div className={classes.detailsitemcontent}>
          Bedrooms: {listing.basics.bedrooms.length}
        </div>
        <div className={classes.detailsitemcontent}>
          Bathrooms: {listing.basics.bathrooms}
        </div>
      </>
    );
  }

  if (isLoading === "price") {
    contentPrice = <LoadingSpinner />;
  } else if (editingField === "price") {
    if (listing) {
      contentPrice = (
        <div>
          <IncrementalInputField
            data={editValue}
            setData={setEditValue}
            type="price"
            handleOnChange={handleEditChange}
          />
          <button
            disabled={editValue.price < 25}
            onClick={() => handleEditSubmit("price", editValue.price)}
          >
            Save
          </button>
          <button onClick={() => setEditingField("")}>Cancel</button>
        </div>
      );
    } else {
      contentPrice = <LoadingSpinner />;
    }
  } else if (listing) {
    contentPrice = (
      <div className={classes.detailsitemcontent}>${listing.price} CAD</div>
    );
  }

  return (
    <>
      <div className={classes.container}>
        {!listing ? (
          <div>Loading</div>
        ) : (
          <>
            <div className={classes.headercontainer}>
              <h3>{listing.title}</h3>
              <div className={classes.previewcontainer}>
                <div onClick={() => handlePreviewClick(listing)}>
                  Preview Listing
                </div>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
            <div className={classes.contentcontainer}>
              <div className={classes.detailscontainer}>
                <div className={classes.detailstitle}>Listing Basics</div>
                <div className={classes.detailscontent}>
                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>
                        Listing title
                      </div>
                      <div className={classes.detailsitemcontent}>
                        {isLoading === "title" ? (
                          <LoadingSpinner />
                        ) : editingField === "title" ? (
                          <>
                            <input
                              type="text"
                              value={editValue}
                              onChange={handleEditChange}
                            />
                            <button
                              disabled={editValue.length < 1}
                              onClick={() =>
                                handleEditSubmit("title", editValue)
                              }
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingField("");
                                setEditValue("");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>{listing.title}</>
                        )}
                      </div>
                    </div>
                    <div
                      className={classes.detailsitemright}
                      onClick={() => handleEditClick("title", listing.title)}
                    >
                      Edit
                    </div>
                  </div>
                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>
                        Listing description
                      </div>
                      <div className={classes.detailsitemcontent}>
                        {isLoading === "description" ? (
                          <LoadingSpinner />
                        ) : editingField === "description" ? (
                          <>
                            <input
                              type="text"
                              value={editValue}
                              onChange={handleEditChange}
                            />
                            <button
                              disabled={editValue.length < 1}
                              onClick={() =>
                                handleEditSubmit("description", editValue)
                              }
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingField("");
                                setEditValue("");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>{listing.description}</>
                        )}
                      </div>
                    </div>
                    <div
                      className={classes.detailsitemright}
                      onClick={() =>
                        handleEditClick("description", listing.description)
                      }
                    >
                      Edit
                    </div>
                  </div>

                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>
                        Listing status
                      </div>
                      <div className={classes.detailsitemcontent}>
                        {isLoading === "published" ? (
                          <LoadingSpinner />
                        ) : editingField === "published" ? (
                          <>
                            <div
                              className={classes.horizontalflextop}
                              onClick={() => setEditValue(true)}
                            >
                              <div className={classes.radiobuttoncontainer}>
                                <div
                                  className={
                                    editValue === true
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                />
                              </div>
                              <div className={classes.verticalflex}>
                                <input
                                  className={
                                    editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                  type="radio"
                                  checked={editValue === true}
                                  style={{ display: "none" }}
                                />
                                <div className={classes.horizontalflex}>
                                  <div className={classes.listingpublished}>
                                    ●
                                  </div>
                                  <div>Published</div>
                                </div>
                                <div>
                                  Your listing is publicly viewable and
                                  bookable.
                                </div>
                              </div>
                            </div>
                            <div
                              className={classes.horizontalflextop}
                              onClick={() =>
                                !isAnyRequestActive && setEditValue(false)
                              }
                              style={
                                isAnyRequestActive
                                  ? { opacity: 0.5, pointerEvents: "none" }
                                  : {}
                              }
                            >
                              <div className={classes.radiobuttoncontainer}>
                                <div
                                  className={
                                    !editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                />
                              </div>
                              <div className={classes.verticalflex}>
                                <input
                                  className={
                                    !editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                  type="radio"
                                  checked={!editValue}
                                  style={{ display: "none" }}
                                />
                                <div className={classes.horizontalflex}>
                                  <div className={classes.listingnotpublished}>
                                    ●
                                  </div>
                                  <div>Not published</div>
                                </div>
                                <div>
                                  Your listing is not publicly viewable or
                                  bookable.
                                </div>
                              </div>
                            </div>
                            <div
                              className={classes.horizontalflextop}
                              onClick={() =>
                                !isAnyRequestActive && setEditValue("delete")
                              }
                              style={
                                isAnyRequestActive
                                  ? { opacity: 0.5, pointerEvents: "none" }
                                  : {}
                              }
                            >
                              <div className={classes.radiobuttoncontainer}>
                                <div
                                  className={
                                    editValue === "delete"
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                />
                              </div>
                              <div className={classes.verticalflex}>
                                <input
                                  className={
                                    editValue === "delete"
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                  type="radio"
                                  checked={editValue === "delete"}
                                  style={{ display: "none" }}
                                />
                                <div className={classes.horizontalflex}>
                                  <div className={classes.listingnotpublished}>
                                    ●
                                  </div>
                                  <div>Delete</div>
                                </div>
                                <div>Permanently delete your listing</div>
                              </div>
                            </div>
                            <div
                              className={classes.buttonContainer}
                              data-tooltip-id="info-tooltip"
                              data-tooltip-content={
                                "You can't unpublish or delete this listing because you currently have an accepted request in progress"
                              }
                            >
                              {isAnyRequestActive && (
                                <div className={classes.infoIcon}>
                                  <Tooltip
                                    id="info-tooltip"
                                    className={classes.tooltip}
                                  />
                                  <FontAwesomeIcon icon={faInfoCircle} />
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  if (!isAnyRequestActive) {
                                    if (editValue !== true) {
                                      setOpenDialog(true);
                                    } else {
                                      handleEditSubmit("published", editValue);
                                    }
                                  }
                                }}
                                className={classes.button}
                                disabled={isAnyRequestActive}
                              >
                                Save
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                setEditingField("");
                                setEditValue("");
                              }}
                            >
                              Cancel
                            </button>
                            <Dialog
                              open={openDialog}
                              onClose={() => setOpenDialog(false)}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <DialogTitle id="alert-dialog-title">
                                {editValue === "delete"
                                  ? "Confirm Delete"
                                  : "Confirm Unpublishing"}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  {editValue === "delete"
                                    ? "By permanently deleting your listing, all current pending requests on the listing will get rejected and you can never relist. Do you wish to continue?"
                                    : "By not publishing your listing, all current pending requests on the listing will get rejected. Do you wish to continue?"}
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => setOpenDialog(false)}
                                  color="primary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleEditSubmit(
                                      "published",
                                      editValue,
                                      true
                                    );
                                    setOpenDialog(false);
                                  }}
                                  color="primary"
                                  autoFocus
                                >
                                  Continue
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </>
                        ) : (
                          <>
                            {listing.published
                              ? "Published"
                              : listing.isDeleted
                              ? "Deleted"
                              : "Not published"}
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className={classes.detailsitemright}
                      onClick={() =>
                        handleEditClick("published", listing.isDeleted ? "delete" : listing.published)
                      }
                    >
                      Edit
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.detailscontainer}>
                <div className={classes.detailstitlecontainer}>
                  <div className={classes.detailstitle}>Amenities</div>
                  <div
                    className={classes.detailsitemright}
                    onClick={() => {
                      setEditingField("amenities");
                      setEditAmenities({ ...listing.amenities });
                    }}
                  >
                    Edit
                  </div>
                </div>
                <div className={classes.detailscontent}>
                  {isLoading === "amenities" ? (
                    <LoadingSpinner />
                  ) : editingField === "amenities" ? (
                    <>
                      <div className={classes.grid}>
                        {Object.keys(editAmenities).map((amenity) => (
                          <div
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={`${classes.amenityItem} ${
                              editAmenities[amenity]
                                ? classes.amenityItemTrue
                                : classes.amenityItemFalse
                            }`}
                          >
                            {amenity}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          handleEditSubmit("amenities", editAmenities)
                        }
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingField("");
                          setEditValue("");
                          setEditAmenities(null);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className={classes.detailsitemcontent}>
                      {Object.keys(listing.amenities)
                        .filter((amenity) => listing.amenities[amenity])
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>

              <div className={classes.detailscontainer}>
                <div className={classes.detailstitle}>Location</div>
                {isLoaded ? (
                  <div className={classes.detailscontent}>
                    <div className={classes.detailsitem}>
                      <div className={classes.detailsitemleft}>
                        <div className={classes.detailsitemtitle}>Address</div>
                        {isLoading === "location" ? (
                          <LoadingSpinner />
                        ) : isEditingLocation ? (
                          // Render form if editing
                          <form className={classes.addressformcontainer}>
                            <FormInputField
                              type="address"
                              placeholder="Street Address"
                              name="address1"
                              value={locationForm.address1 || ""}
                              onChange={handleChange}
                              errorMessage="Your street address can't be blank"
                              required={true}
                            />
                            <FormInputField
                              type="address"
                              placeholder="Apartment, unit, suite, or floor #"
                              name="unitnumber"
                              value={locationForm.unitnumber || ""}
                              onChange={handleChange}
                            />
                            <FormInputField
                              type="address"
                              placeholder="City"
                              name="city"
                              value={locationForm.city || ""}
                              errorMessage="Your city can't be blank"
                              onChange={handleChange}
                              required={true}
                            />
                            <FormInputField
                              type="address"
                              placeholder="State/Province"
                              name="stateprovince"
                              value={locationForm.stateprovince || ""}
                              errorMessage="Your state/province can't be blank"
                              onChange={handleChange}
                              required={true}
                            />
                            <FormInputField
                              type="address"
                              placeholder="Postal Code"
                              name="postalcode"
                              value={locationForm.postalcode || ""}
                              onChange={handleChange}
                              errorMessage="Your postal code must match Canada (A1A 1A1) or USA (96910–96932)"
                              pattern="([A-Za-z]\d[A-Za-z][\-\s]?\d[A-Za-z]\d)|(\d{5}([\-\s]\d{4})?)"
                              required={true}
                            />

                            <FormInputField
                              type="address"
                              placeholder="Country/Region"
                              name="countryregion"
                              value={locationForm.countryregion || ""}
                              onChange={handleChange}
                              errorMessage="Your country can't be blank"
                              required={true}
                            />
                            {partialAddress ? (
                              <div className={classes.errorcontainer}>
                                <div className={classes.errormessage}>
                                  We dont recognize that address.
                                </div>
                                <div>
                                  Did you mean:
                                  <div>{partialAddress}</div>
                                </div>
                              </div>
                            ) : null}

                            {incorrectAddress ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setForceSave(true, () => {
                                    handleEditSubmit("location", locationForm);
                                  });
                                }}
                              >
                                Save Anyway
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditSubmit("location", locationForm)
                                }
                              >
                                Save
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setIsEditingLocation(false)}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          // Render address normally if not editing
                          <div className={classes.detailsitemcontent}>
                            {formattedAddress}
                          </div>
                        )}
                      </div>
                      <div className={classes.detailsitemright}>
                        <div onClick={() => setIsEditingLocation(true)}>
                          Edit
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className={classes.detailscontainer}>
                <div className={classes.detailstitle}>Property and rooms</div>
                <div className={classes.detailscontent}>
                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>Property</div>
                      {isLoading === "aboutyourplace" ? (
                        <LoadingSpinner />
                      ) : editingField === "aboutyourplace" ? (
                        <div className={classes.propertydropdowns}>
                          <FormDropdownField
                            label="Property Type"
                            options={propertyDisplayOptions}
                            name="propertyType"
                            value={
                              propertyDisplayOptions[
                                propertyValueOptions.indexOf(
                                  editValue.propertyType
                                )
                              ] || ""
                            }
                            onChange={(e) =>
                              setEditValue({
                                ...editValue,
                                propertyType:
                                  propertyValueOptions[
                                    propertyDisplayOptions.indexOf(
                                      e.target.value
                                    )
                                  ],
                              })
                            }
                          />
                          <FormDropdownField
                            label="Privacy Type"
                            options={privacyDisplayOptions}
                            name="privacyType"
                            value={
                              privacyDisplayOptions[
                                privacyValueOptions.indexOf(
                                  editValue.privacyType
                                )
                              ] || ""
                            }
                            onChange={(e) =>
                              setEditValue({
                                ...editValue,
                                privacyType:
                                  privacyValueOptions[
                                    privacyDisplayOptions.indexOf(
                                      e.target.value
                                    )
                                  ],
                              })
                            }
                          />
                          <button
                            onClick={() =>
                              handleEditSubmit("aboutyourplace", editValue)
                            }
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingField("")}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className={classes.detailsitemleft}>
                            <div className={classes.detailsitemcontent}>
                              Property Type:{" "}
                              {listing.aboutyourplace.propertyType}
                            </div>
                            <div className={classes.detailsitemcontent}>
                              Privacy Type:{" "}
                              {
                                privacyDisplayOptions[
                                  privacyValueOptions.indexOf(
                                    listing.aboutyourplace.privacyType
                                  )
                                ]
                              }
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={classes.detailsitemright}>
                      <div
                        onClick={() =>
                          handleEditClick(
                            "aboutyourplace",
                            listing.aboutyourplace
                          )
                        }
                      >
                        Edit
                      </div>
                    </div>
                  </div>
                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>Bedrooms</div>
                      {contentBasics}
                    </div>
                    <div className={classes.detailsitemright}>
                      <div
                        onClick={() => handleEditClick("basics", editBasics)}
                      >
                        Edit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.detailscontainer}>
                <div className={classes.detailstitle}>
                  <div>Photos</div>
                  <div
                    className={classes.detailsitemright}
                    onClick={() => {
                      handleEditClick("photos", listing.images);
                      setOpenPhotos(true);
                    }}
                  >
                    Edit
                  </div>
                </div>
                <div className={classes.detailscontent}>
                  {isLoading === "photos" ? (
                    <LoadingSpinner />
                  ) : (
                    images && (
                      <>
                        <ScrollUpModal
                          variable={openPhotos}
                          setVariable={setOpenPhotos}
                        >
                          <Photos
                            data={{ images: images }}
                            setData={setImages}
                            setOpenPhotos={setOpenPhotos}
                            setEditingField={setEditingField}
                            setEditValue={setEditValue}
                          />
                        </ScrollUpModal>
                        <div className={classes.carouselcontainer}>
                          <Carousel
                            dots={false}
                            images={images?.map(({ url }) => url)}
                            index={0}
                            from={"ManageListing"}
                            slidesToShow={2}
                            addMargins={true}
                            setWidth={true}
                            borderRadius={true}
                          />
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
              <div className={classes.detailscontainer}>
                <div className={classes.detailstitle}>
                  Pricing and Availability
                </div>
                <div className={classes.detailscontent}>
                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>
                        Monthly Price
                      </div>
                      {contentPrice}
                    </div>
                    <div className={classes.detailsitemright}>
                      <div
                        onClick={() => handleEditClick("price", listing.price)}
                      >
                        Edit
                      </div>
                    </div>
                  </div>
                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailsitemtitle}>
                        Availability for Shorter Stays
                      </div>
                      <div className={classes.detailsitemcontent}>
                        {isLoading === "shorterStays" ? (
                          <LoadingSpinner />
                        ) : editingField === "shorterStays" ? (
                          <>
                            <div
                              className={classes.horizontalflextop}
                              onClick={() => setEditValue(true)}
                            >
                              <div className={classes.radiobuttoncontainer}>
                                <div
                                  className={
                                    editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                />
                              </div>
                              <div className={classes.verticalflex}>
                                <input
                                  className={
                                    editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                  type="checkbox"
                                  checked={editValue}
                                  style={{ display: "none" }}
                                />
                                <div className={classes.horizontalflex}>
                                  <div className={classes.listingpublished}>
                                    ●
                                  </div>
                                  <div>Available for Shorter/Longer Stays</div>
                                </div>
                                <div>
                                  Subtenants can request shorter or longer
                                  stays.
                                </div>
                              </div>
                            </div>
                            <div
                              className={classes.horizontalflextop}
                              onClick={() => setEditValue(false)}
                            >
                              <div className={classes.radiobuttoncontainer}>
                                <div
                                  className={
                                    !editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                />
                              </div>
                              <div className={classes.verticalflex}>
                                <input
                                  className={
                                    !editValue
                                      ? classes.selectedRadioButton
                                      : classes.radioButton
                                  }
                                  type="checkbox"
                                  checked={!editValue}
                                  style={{ display: "none" }}
                                />
                                <div className={classes.horizontalflex}>
                                  <div className={classes.listingnotpublished}>
                                    ●
                                  </div>
                                  <div>
                                    Not Available for Shorter/Longer Stays
                                  </div>
                                </div>
                                <div>
                                  Subtenants cannot request shorter or longer
                                  stays.
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleEditSubmit("shorterStays", editValue)
                              }
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingField("");
                                setEditValue("");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {listing.shorterStays
                              ? "Available for Shorter/Longer Stays"
                              : "Not Available for Shorter/Longer Stays"}
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className={classes.detailsitemright}
                      onClick={() =>
                        handleEditClick("shorterStays", listing.shorterStays)
                      }
                    >
                      Edit
                    </div>
                  </div>

                  <div className={classes.detailsitem}>
                    <div className={classes.detailsitemleft}>
                      <div className={classes.detailstitle}>
                        <div className={classes.detailsitemtitle}>
                          Available Dates
                        </div>
                        <div
                          className={classes.detailsitemright}
                          onClick={() => handleEditClick("dates", dates)}
                        >
                          Edit
                        </div>
                      </div>

                      <div className={classes.detailsitemcontent}>
                        {dates ? (
                          editingField === "dates" ? (
                            <div className={classes.detailscontainer}>
                              <div>
                                Set the dates that are available for sublet
                              </div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label={"Move-In"}
                                  openTo="month"
                                  value={dates.moveInDate}
                                  onChange={handleOnChangeMoveIn}
                                  views={["year", "month", "day"]}
                                  disablePast
                                />
                                <DatePicker
                                  label={"Move-Out"}
                                  openTo="month"
                                  value={dates.moveOutDate}
                                  onChange={handleOnChangeMoveOut}
                                  views={["year", "month", "day"]}
                                  minDate={dates.moveInDate}
                                  disablePast
                                  disableHighlightToday
                                />
                              </LocalizationProvider>
                              <button
                                onClick={() => handleEditSubmit("dates", dates)}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingField("");
                                  setEditValue("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div>
                                Move in:{" "}
                                {dates.moveInDate?.format("YYYY-MM-DD")}
                              </div>
                              <div>
                                Move out:{" "}
                                {dates.moveOutDate?.format("YYYY-MM-DD")}
                              </div>
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}

export default ManageListing;
