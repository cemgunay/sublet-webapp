import React from "react";
import api from "../../api/axios";

import classes from "./ConfirmLocation.module.css";

function ConfirmLocation(props) {

  //If there is error but user believes their address is correct
  const handleNext = async () => {
    props.setConfirmMarker(true);

    const { _id, ...updateData } = props.data;

    try {
      await api.put("/listings/" + props.data._id, updateData);
    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className={classes.container}>
      <div>
      </div>
      <div>Confirm your address</div>
      <input
        type="address"
        placeholder="Street Address"
        name="address1"
        value={props.data.location.address1 || ""}
        onChange={props.handleChange}
        required
      />
      <input
        type="address"
        placeholder="Apartment, unit, suite, or floor #"
        name="unitnumber"
        value={props.data.location.unitnumber || ""}
        onChange={props.handleChange}
      />
      <input
        type="address"
        placeholder="City"
        name="city"
        value={props.data.location.city || ""}
        onChange={props.handleChange}
        required
      />
      <input
        type="address"
        placeholder="State/Province"
        name="stateprovince"
        value={props.data.location.stateprovince || ""}
        onChange={props.handleChange}
        required
      />
      <input
        type="address"
        placeholder="Postal Code"
        name="postalcode"
        value={props.data.location.postalcode || ""}
        onChange={props.handleChange}
        required
      />
      <input
        type="address"
        placeholder="Country/Region"
        name="countryregion"
        value={props.data.location.countryregion || ""}
        onChange={props.handleChange}
        required
      />
      {props.incorrectAddress ? (
        <div>
          <div>We dont recognize that address.</div>
          <div>Did you mean? {props.partialAddress}</div>
          <button type="button" onClick={handleNext}>
            Yes, my address is correct
          </button>
        </div>
      ) : null}
      <div>
      </div>
    </div>
  );
}

export default ConfirmLocation;
