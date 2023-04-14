import React, { useRef, useCallback } from "react";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

import classes from './LocationMarker.module.css'

const libraries = ["places"];

function LocationMarker(props) {
  //load google maps api
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  //set location center
  const center = {
    lat: props.lat,
    lng: props.lng,
  };

  //useRef for loading map and getting its reference element
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    <div className={classes.container}>
      {!isLoaded ? (
        "holdup"
      ) : (
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            scrollwheel: false,
            gestureHandling: 'none'
          }}
          onLoad={onMapLoad}
        >
          <Marker position={center} />
        </GoogleMap>
      )}
    </div>
  );
}

export default LocationMarker;
