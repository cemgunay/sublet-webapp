import React from "react";
import { useNavigate } from "react-router-dom";
import useListFormContext from "../../hooks/useListFormContext";

import api from "../../api/axios";

import classes from "./TopBar.module.css";

function TopBar() {
  const { urlTitleReverse, page, data, setData } = useListFormContext();

  console.log(urlTitleReverse[page]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    navigate("/host/list");

    const { _id, ...updateData } = data;

    if (urlTitleReverse[page] === "location") {

      const updateData = {
        location: {
          address1: data.location.address1,
          city: data.location.city,
          postalcode: data.location.postalcode,
          countryregion: data.location.countryregion,
          unitnumber: data.location.unitnumber,
          stateprovince: data.location.stateprovince,
          lat: data.location.lat,
          lng: data.location.lng
        },
        userId: data.userId,
      };

      try {
        await api.put("/listings/" + data._id, updateData);
      } catch (err) {
        console.log(err);
      }
    }
    
    else if (urlTitleReverse[page] === "photos") {
      
    }
    else {

      try {
        await api.put("/listings/" + data._id, updateData);
      } catch (err) {
        console.log(err);
      }
    }

    localStorage.setItem("listId", JSON.stringify(""))

    setData(
      {...data, 
        _id: "",
        title: "",
        address: "",
        city: "",
        moveInDate: "",
        moveOutDate: "",
        aboutyourplace: {
          propertyType: "",
          privacyType: ""
        },
        location: {
          address1: "",
          city: "",
          countryregion: "",
          postalcode: "",
          stateprovince: "",
          unitnumber: "",
          lat: "",
          lng: ""
        },
        price: "",
        description: ""}
      )

  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.save} onClick={handleSubmit}>Save & Exit</div>
        <div className={classes.questions}>Questions</div>
      </div>
    </div>
  );
}

export default TopBar;
