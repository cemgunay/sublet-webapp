import React from "react";

import classes from "./BedroomItem.module.css";
import BedType from "./BedType";

function BedroomItem(props) {
  const bedTypes = ["Single", "Double", "Queen", "King", "Sofa Bed", "Other"];

  const handleChange = (e) => {
    const newData = { ...props.data };
    newData.basics.bedrooms[props.index].ensuite = e.target.checked;
    props.setData(newData)
  }

  return (
    <div className={classes.container}>
      <div>Bedroom {props.index + 1}</div>
      <div className={classes.bedType}>
        {bedTypes.map((bedType, index) => (
          <BedType
            key={index}
            index={props.index}
            bedType={bedType}
            bedroom={props.bedroom}
            data={props.data}
            setData={props.setData}
          />
        ))}
      </div>
      <div>
        <input id={`ensuite-${props.index}`} type="checkbox" checked={props.bedroom.ensuite} onChange={handleChange}/>
        <label htmlFor="ensuite">Ensuite?</label>
      </div>
    </div>
  );
}

export default BedroomItem;
