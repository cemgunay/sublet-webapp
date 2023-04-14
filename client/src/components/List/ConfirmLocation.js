import React from "react";
import api from "../../api/axios";
import FormInputField from "../Util/FormInputField";

import classes from "./ConfirmLocation.module.css";

function ConfirmLocation(props) {
  //If there is error but user believes their address is correct
  const handleNext = async () => {
    props.setConfirmMarker(true);

    // Validate the postal code or zip code using the regex pattern
    const postalOrZipCodeRegex =
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d|^\d{5}(?:[-\s]\d{4})?$/;

    if (!postalOrZipCodeRegex.test(props.data.location.postalcod)) {
      alert("Invalid postal code or zip code!");
      return;
    }

    const { _id, ...updateData } = props.data;

    try {
      await api.put("/listings/" + props.data._id, updateData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>Confirm your address</div>
      <form id="confirmaddress" className={classes.addressformcontainer}>
        <FormInputField
          type="address"
          placeholder="Street Address"
          name="address1"
          value={props.data.location.address1 || ""}
          onChange={props.handleChange}
          errorMessage="Your street address can't be blank"
          required={true}
        />
        <FormInputField
          type="address"
          placeholder="Apartment, unit, suite, or floor #"
          name="unitnumber"
          value={props.data.location.unitnumber || ""}
          onChange={props.handleChange}
        />
        <FormInputField
          type="address"
          placeholder="City"
          name="city"
          value={props.data.location.city || ""}
          errorMessage="Your city can't be blank"
          onChange={props.handleChange}
          required={true}
        />
        <FormInputField
          type="address"
          placeholder="State/Province"
          name="stateprovince"
          value={props.data.location.stateprovince || ""}
          errorMessage="Your state/province can't be blank"
          onChange={props.handleChange}
          required={true}
        />
        <FormInputField
          type="address"
          placeholder="Postal Code"
          name="postalcode"
          value={props.data.location.postalcode || ""}
          onChange={props.handleChange}
          errorMessage="Your postal code must match Canada (A1A 1A1) or USA (96910–96932)"
          pattern="^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d|^\d{5}(?:[-\s]\d{4})?$"
          required={true}
        />
        <FormInputField
          type="address"
          placeholder="Country/Region"
          name="countryregion"
          value={props.data.location.countryregion || ""}
          onChange={props.handleChange}
          errorMessage="Your country can't be blank"
          required={true}
        />
        {props.incorrectAddress ? (
          <div className={classes.errorcontainer}>
            <div className={classes.errormessage}>
              We dont recognize that address.
            </div>
            <div>
              Did you mean:
              <div>{props.partialAddress}</div>
            </div>
            <button type="button" onClick={handleNext}>
              No, I entered the correct address
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default ConfirmLocation;
