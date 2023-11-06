import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";
import api from "../../api/axios";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

//These are if I need to implement location bias in search

/*
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
*/

import classes from "./Location.module.css";
import ConfirmLocation from "../../components/List/ConfirmLocation";
import ConfirmMarker from "../../components/List/ConfirmMarker";

//for the useJsApiLoader
const libraries = ["places"];

function Location() {
  //to fill in the address form from autocompleted address
  const address = useState({
    address1: "",
    postalcode: "",
    city: "",
    stateprovince: "",
    countryregion: "",
    unitnumber: "",
  });

  const {
    urlTitleReverse,
    page,
    setPage,
    data,
    setData,
    handleChange,
    currentUserId,
    canGoNext,
    setBackButtonClicked,
  } = useOutletContext();

  //get users current location
  const [center, setCenter] = useState({
    lat: "",
    lng: "",
  });

  //set center on users current location
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    console.log(data.location.lat);

    if (data.location.lat) {
      setIsCentered(true);
    } else {
      console.log("here1");

      navigator.permissions
        .query({ name: "geolocation" })
        .then((response) => {
          console.log("here2");

          const options = {
            enableHighAccuracy: true,
          };

          const success = (position) => {
            console.log("Success callback executed", position);
            setCenter((center) => ({
              ...center,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }));
            setIsCentered(true);
          };

          const error = (error) => {
            // If user denies permission after the prompt or in error, set a default location
            if (error.code === error.PERMISSION_DENIED) {
              setCenter((center) => ({
                ...center,
                lat: 43.7223424,
                lng: -80.3706496,
              }));
              setIsCentered(true);
            } else {
              console.log(error.code, error.message);
            }
          };

          if (response.state === "denied") {
            console.log("here3");
            setCenter((center) => ({
              ...center,
              lat: 43.7223424,
              lng: -80.3706496,
            }));
            setIsCentered(true);
          } else if (
            response.state === "granted" ||
            response.state === "prompt"
          ) {
            // Handle both "granted" and "prompt" states here
            console.log("here4");
            navigator.geolocation.getCurrentPosition(success, error, options);
          } else {
            console.log("here5");
            console.log(response.state);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [data.location.lat]);

  //load google maps api
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    console.log("It is set!");
  } else {
    console.log("No set!");
  }

  //make sure all elements not just the above isloaded is rendered and loaded in
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (isLoaded && isCentered) {
      setShowMap(true);
    }
  }, [isCentered, isLoaded]);

  //useRef for loading map and getting its reference element
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  //to reposition map and marker based on autocompleted address
  const [searchResult, setSearchResult] = useState(
    /** @type google.maps.Map */ ("Result: none")
  );

  //For the autocomplete component onLoad
  const onLoad = (autocomplete) => {
    setSearchResult(autocomplete);
  };

  //For when the autocomplete is selected
  const handleOnPlaceChanged = async () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setCenter((center) => ({
        ...center,
        lat: lat,
        lng: lng,
      }));

      handleAddressFill(place);

      setData((prevData) => ({
        ...prevData,
        location: {
          address1: address.address1,
          city: address.city,
          countryregion: address.countryregion,
          postalcode: address.postalcode,
          stateprovince: address.stateprovince,
          unitnumber: address.unitnumber,
          lat: lat,
          lng: lng,
        },
      }));

      //If PlacesService has to be used

      /*

      let coords = [];

      let request = {
        query: "74444447 Brandenburg Blvd",
        fields: ["name", "geometry"]
      };
  
      let service = new window.google.maps.places.PlacesService(document.createElement('div'));

      service.findPlaceFromQuery(request, (results, status) => {
        console.log(request)
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log(results)
          }
        }
      );

      */

      setConfirmLocation(true);
    } else {
      alert("Please enter text");
    }
  };

  //To fill the confirm address form and breakdown the full place address into components
  const handleAddressFill = (place) => {
    address.address1 = "";

    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address.address1 = `${component.long_name} ${address.address1}`;
          break;
        }

        case "route": {
          address.address1 += component.short_name;
          break;
        }

        case "postal_code": {
          address.postalcode = component.long_name;
          break;
        }

        case "postal_code_suffix": {
          address.postalcode = `${address.postalcode}-${component.long_name}`;
          break;
        }
        case "locality":
          address.city = component.long_name;
          break;
        case "administrative_area_level_1": {
          address.stateprovince = component.short_name;
          break;
        }
        case "country": {
          address.countryregion = component.long_name;
          break;
        }
        default:
          break;
      }
    }
  };

  //For when user wants to manually enter address
  const handleOnClick = () => {
    setConfirmLocation(true);
  };

  //variables for setting front end rendering
  const [confirmLocation, setConfirmLocation] = useState(false);
  const [confirmMarker, setConfirmMarker] = useState(false);
  const [incorrectAddress, setIncorrectAddress] = useState(false);
  const [partialAddress, setPartialAddress] = useState();

  const navigate = useNavigate();

  //update the center on refresh
  useEffect(() => {
    setCenter({
      lat: data.location.lat,
      lng: data.location.lng,
    });
  }, [data.location.lat, data.location.lng]);

  console.log(center);

  //To check if manually entered address is valid and gives a recommendation
  const handleCheck = () => {
    const formattedAddress =
      data.location.address1 +
      ", " +
      data.location.city +
      ", " +
      data.location.stateprovince +
      " " +
      data.location.postalcode +
      ", " +
      data.location.countryregion;

    let geocoder = new window.google.maps.Geocoder();

    console.log(formattedAddress);

    geocoder.geocode(
      { address: formattedAddress },
      function handleResults(results, status) {
        console.log(status);
        console.log(results);
        console.log(Object.hasOwn(results[0], "partial_match"));

        const place = results[0];

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setCenter((center) => ({
          ...center,
          lat: lat,
          lng: lng,
        }));

        //check if there is a partial match
        if (Object.hasOwn(results[0], "partial_match") === true) {
          setIncorrectAddress(true);
          setPartialAddress(results[0].formatted_address);
        } else {
          setIncorrectAddress(false);
          setConfirmMarker(true);

          const { _id, ...updateData } = data;

          api
            .put("/listings/" + data._id, updateData)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => console.error(error));
        }
      }
    );
  };

  //to handle next button
  const handleSubmit = async (e) => {
    e.preventDefault();

    setBackButtonClicked(true);

    if (!confirmLocation && !confirmMarker) {
      setConfirmLocation(true);
    } else if (confirmLocation && !confirmMarker) {
      handleCheck();
    } else if (confirmLocation && confirmMarker) {
      setData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          lat: center.lat,
          lng: center.lng,
        },
      }));

      const updateData = {
        location: {
          address1: data.location.address1,
          city: data.location.city,
          postalcode: data.location.postalcode,
          countryregion: data.location.countryregion,
          unitnumber: data.location.unitnumber,
          stateprovince: data.location.stateprovince,
          lat: center.lat,
          lng: center.lng,
        },
        userId: data.userId,
      };

      console.log(updateData);

      //const { _id, ...updateData } = data;

      try {
        await api.put("/listings/" + data._id, updateData);
      } catch (err) {
        console.log(err);
      }

      const currentUrl = window.location.pathname;
      const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
      setPage((prev) => prev + 1);
      navigate(newUrl + "/" + urlTitleReverse[page + 1]);

      //setData

      //increase page number

      console.log("submitted!");
    }
  };

  //auto render the correct component based on whats already filled in from server
  const [addressExists, setAddressExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings/" + data._id)
      .then((response) => {
        console.log(response.data);

        const address = response.data.location.address1;

        if (address) {
          setAddressExists(true);
        } else {
          setAddressExists(false);
        }

        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [data._id]);

  //auto render the correct component based on whats already filled in from server
  useEffect(() => {
    if (addressExists) {
      setConfirmLocation(true);
      setConfirmMarker(true);
    }
  }, [addressExists]);

  console.log(confirmLocation);
  console.log(loading);

  return (
    <div className={classes.container}>
      {loading ? (
        <div>HOLDUP</div>
      ) : (
        <>
          <div>Wheres yo shit located fam?</div>
          <form className={classes.form} id="location" onSubmit={handleSubmit}>
            {!showMap ? (
              "holdup"
            ) : (
              <div className={classes.mapContainer}>
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={handleOnPlaceChanged}
                >
                  <input
                    type="address"
                    placeholder="address"
                    name="address"
                    ref={mapRef}
                  />
                </Autocomplete>
                {confirmLocation ? (
                  <div>
                    <ConfirmLocation
                      data={data}
                      handleChange={handleChange}
                      confirmLocation={confirmLocation}
                      setConfirmLocation={setConfirmLocation}
                      handleAddressFill={handleAddressFill}
                      setConfirmMarker={setConfirmMarker}
                      setCenter={setCenter}
                      incorrectAddress={incorrectAddress}
                      partialAddress={partialAddress}
                    />
                    {confirmMarker ? (
                      <ConfirmMarker
                        onMapLoad={onMapLoad}
                        center={center}
                        setCenter={setCenter}
                        data={data}
                      />
                    ) : null}
                  </div>
                ) : (
                  <button type="button" onClick={handleOnClick}>
                    enter that shit manually young BLUD
                  </button>
                )}
                <GoogleMap
                  center={center}
                  zoom={15}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={onMapLoad}
                >
                  <Marker position={center} />
                </GoogleMap>
              </div>
            )}
            <BottomBar
              form={urlTitleReverse[page]}
              page={page}
              setPage={setPage}
              urlTitleReverse={urlTitleReverse}
              listId={data._id}
              currentUserId={currentUserId}
              data={data}
              setData={setData}
              canGoNext={canGoNext}
              confirmLocation={confirmLocation}
              setConfirmLocation={setConfirmLocation}
              confirmMarker={confirmMarker}
              setConfirmMarker={setConfirmMarker}
            />
          </form>
        </>
      )}
    </div>
  );
}

export default Location;

/*

<input
          type="address"
          placeholder="address"
          name="address"
          value={data.address || ""}
          required
          onChange={handleChange}
        />

*/
