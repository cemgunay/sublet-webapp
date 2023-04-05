import React from "react";
import BedroomItem from "./BedroomItem";

import classes from "./BedroomList.module.css";

function BedroomList(props) {

  const bedrooms = props.data.basics.bedrooms;
  const numberOfBedrooms = bedrooms.length;

  return (
    <div className={classes.container}>
      {numberOfBedrooms > 0 &&
        bedrooms.map((bedroom, index) => (
          <BedroomItem
            key={index}
            index={index}
            ensuite={bedroom.ensuite}
            bedroom={bedrooms[index]}
            data={props.data}
            setData={props.setData}
          />
        ))}
    </div>
  );
}

export default BedroomList;
