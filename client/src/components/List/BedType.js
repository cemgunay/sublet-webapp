import React, { useState } from "react";

import classes from "./BedType.module.css";

function BedType(props) {
  const { bedType, bedroom, index, setData } = props;

  const handleBedTypeChange = (e) => {
    console.log(e.target);
    const bedTypeValue = e.target.value;
    const bedTypeIndex = bedroom.bedType.indexOf(bedTypeValue);

    if (bedTypeIndex === -1) {
      // Add bed type to array if it doesn't exist
      const updatedBedTypes = [...bedroom.bedType, bedTypeValue];
      const updatedBedroom = { ...bedroom, bedType: updatedBedTypes };
      const updatedBedrooms = [...props.data.basics.bedrooms];
      updatedBedrooms[index] = updatedBedroom;

      setData({
        ...props.data,
        basics: { ...props.data.basics, bedrooms: updatedBedrooms },
      });
    } else {
      // Remove bed type from array if it exists
      const updatedBedTypes = bedroom.bedType.filter(
        (bedType) => bedType !== bedTypeValue
      );
      const updatedBedroom = { ...bedroom, bedType: updatedBedTypes };
      const updatedBedrooms = [...props.data.basics.bedrooms];
      updatedBedrooms[index] = updatedBedroom;

      setData({
        ...props.data,
        basics: { ...props.data.basics, bedrooms: updatedBedrooms },
      });
    }
  };

  return (
    <div className={classes.bedTypeItem}>
      <input
        id={`bedType-${index}-${bedType}`}
        type="checkbox"
        name={`bedType-${index}`}
        value={bedType}
        checked={bedroom.bedType.includes(bedType)}
        onChange={handleBedTypeChange}
      />
      <label
        htmlFor={`bedType-${index}-${bedType}`}
        className={classes.bedTypeSelection}
      >
        {bedType}
      </label>
    </div>
  );
}

export default BedType;

/*
<input
                id={props.BedType}
                name="propertyType"
                type="radio"
                value={props.BedType}
                checked={props.bedroomData.includes(props.bedType)}
                required
              />
              <label className={classes.propertytypeselection} htmlFor={props.BedType}>
              {props.BedType}
              </label>

              
              */

//[...prevData.basics.bedrooms[props.index].bedType, e.target.value]
