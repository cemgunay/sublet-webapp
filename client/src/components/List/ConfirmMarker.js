import React, { useState, useRef, useCallback, useEffect } from "react";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

import classes from "./ConfirmMarker.module.css";

const libraries = ["places"];

function ConfirmMarker(props) {

//load google maps api
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries, 
  });

  //set Map ref
  const [mapref, setMapRef] = useState(null);

  //get map element on load and load it into mapRef
  const handleOnLoad = (map) => {
    setMapRef(map);
  };

  //set Initial Center
  /*
  const [center, setCenter] = useState(
    {
        lat: props.center.lat,
    }
  )
  */

  //Dynamically give props to the GoogleMap component
  const [mapsProps, setMapsProps] = useState({
    center: props.center,
  });

  //When map is being dragged, constantly update the center
  const handleCenterChanged = () => {
    if (mapref) {
      const newCenter = mapref.getCenter();
      props.setCenter(newCenter);
      setMapsProps({});
    }
  };

  console.log(props.data)

  //Formatted version of address from DB
  const formattedAddress =
      props.data.location.address1 +
      ", " +
      props.data.location.city +
      ", " +
      props.data.location.stateprovince +
      " " +
      props.data.location.postalcode +
      ", " +
      props.data.location.countryregion;

  return (
    <div className={classes.container}>
      <div>Is the pin in the right spot? drag to change if not</div>
      <div>{formattedAddress}</div>
      <div className={classes.mapContainer}>
        {!isLoaded ? <div>Holdup</div> : 
        <GoogleMap
          {...mapsProps}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={handleOnLoad}
          onCenterChanged={handleCenterChanged}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={props.center} />
        </GoogleMap>
        } 
        <div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmMarker;
