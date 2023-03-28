import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";
import api from "../../api/axios";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  StandaloneSearchBox
} from "@react-google-maps/api";

import usePlacesAutocomplete, {getGeocode, getLatLng} from 'use-places-autocomplete'

import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from '@reach/combobox'

import '@reach/combobox/styles.css'



import classes from "./Location.module.css";

const libraries = ['places']

function Location() {

  //to fill in the address form from autocompleted address
  const [address, setAddress] = useState({
    address1: "",
    postalcode: "",
    city: "",
    stateprovince: "",
    countryregion: "",
    unitnumber: ""
  })

  //get users current location
  const [center, setCenter] = useState({
    lat: "",
    lng: "",
  });

  //set center on users current location
  const [isCentered, setIsCentered] = useState(false);

  //useEffect to set current location
  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((response) => {

        if (response.state === "denied") {

          setCenter((center) => ({
            ...center,
            lat: 43.7223424,
            lng: -80.3706496,
          }));
          setIsCentered(true);

        } else if (response.state === "granted") {

          const options = {
            enableHighAccuracy: true,
          };

          const success = (position) => {
            console.log(position);
            setCenter((center) => ({
              ...center,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }));
            setIsCentered(true);
          };

          const error = (error) => {
            console.log(error.code, error.message);
          };

          navigator.geolocation.getCurrentPosition(success, error, options);

        } else {

          console.log(response.state);

        }
      })
      .catch((error) => console.error(error));
  }, []);

  //load google maps api
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  //make sure all elements not just the above isloaded is rendered and loaded in
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (isLoaded && isCentered) {
      setShowMap(true);
    }
  }, [isCentered, isLoaded]);

  //useRef for loading map idk lol
  const mapRef = useRef();
  
  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
    },
    [],
  )

  //to reposition map and marker based on autocompleted address
  const [searchResult, setSearchResult] = useState(/** @type google.maps.Map */("Result: none"));

  const onLoad = (autocomplete) => {
    setSearchResult(autocomplete)
  }

  const [showFullAddress, setShowFullAddress] = useState(false)

  const handleOnClick = () =>{
    setShowFullAddress(true)
  }

  const handleOnPlaceChanged = async () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      console.log(place)

      

      const name = place.name;
      const formattedAddress = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setCenter((center) => ({
        ...center,
        lat: lat,
        lng: lng,
      }));

      console.log(`Name: ${name}`);
      console.log(`Formatted Address: ${formattedAddress}`);

      await handleAddressFill(place);

      setData((prevData) => ({
        ...prevData,
        location: {
          address1: address.address1,
          city: address.city,
          countryregion: address.countryregion,
          postalcode: address.postalcode,
          stateprovince: address.stateprovince,
          unitnumber: address.unitnumber
        },
      }));

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

      setShowFullAddress(true)


    } else {
      alert("Please enter text");
    }
  }

  console.log(address)

  const handleAddressFill = (place) => {
    console.log(place.address_components)
    for (const component of place.address_components) {

      const componentType = component.types[0];

      console.log(componentType)

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
        case "country":
          address.countryregion = component.long_name;
          break;
      }
    }
  }

  const navigate = useNavigate();

  const {
    urlTitleReverse,
    page,
    setPage,
    data,
    setData,
    handleChange,
    currentUserId,
    canGoNext
  } = useOutletContext();

  console.log(data)

  //to handle next button
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { _id, ...updateData } = data;

    try {
      await api.put("/listings/" + data._id, updateData);
    } catch (err) {
      console.log(err);
    }

    setData({ data: {} });

    navigate("/");

    //setData

    //increase page number

    console.log("submitted!");
  };

  return (
    <div className={classes.container}>
      <div>
        Wheres yo shit located fam?
      </div>
      <form className={classes.form} id="location" onSubmit={handleSubmit}>
        {!showMap ? (
          "holdup"
        ) : (
          <div className={classes.mapContainer}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={handleOnPlaceChanged}>
              <input type="address" placeholder="address" name="address" ref={mapRef}/>
            </Autocomplete>
            {showFullAddress ? null : 
            <div>
              <button type="button" onClick={handleOnClick}>enter that shit manually young BLUD</button>
            </div>}
            {!showFullAddress ? null : 
            <>
            <input type="address" placeholder="Street Address" name="address1" value={data.location.address1} onChange={handleChange} required/>
            <input type="address" placeholder="Apartment, unit, suite, or floor #" name="unitnumber" value={data.location.unitnumber} onChange={handleChange}/>
            <input type="address" placeholder="City" name="city" value={data.location.city} onChange={handleChange} required/>
            <input type="address" placeholder="State/Province" name="stateprovince" value={data.location.stateprovince} onChange={handleChange} required/>
            <input type="address" placeholder="Postal Code" name="postalcode" value={data.location.postalcode} onChange={handleChange} required/>
            <input type="address" placeholder="Country/Region" name="countryregion" value={data.location.countryregion} onChange={handleChange} required/>
            </>}
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
        />
      </form>
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
