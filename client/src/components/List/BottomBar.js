import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import ListFormContext from "../../context/ListFormContext";

import classes from "./BottomBar.module.css";
import FormProgressBar from "./FormProgressBar";

function BottomBar(props) {
  const navigate = useNavigate();

  const { setBackButtonClicked } =
  useContext(ListFormContext);

  const handleBack = async () => {

    setBackButtonClicked(true)

    if (props.page === 0) {
      const user = {
        userId: props.currentUserId,
      };

      try {
          await api.delete("/listings/" + props.listId + "/" + user.userId);
          
          //also remove from local storage
          localStorage.setItem("listId", JSON.stringify(""))

          //const {_id, userId, expiryDate, ...updateData} = props.data

          //props.setData(updateData)
          //console.log(updateData)

          props.setData(
          {...props.data, 
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

      } catch (err) {
        console.log(err);
      }
      navigate("/host/list/overview");
    } else if (props.confirmLocation && !props.confirmMarker) {
      props.setConfirmLocation(false)
    } else if (props.confirmMarker) {
      props.setConfirmMarker(false)
    } else {
      const currentUrl = window.location.pathname;
      const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
      props.setPage((prev) => prev - 1);
      navigate(newUrl + "/" + props.urlTitleReverse[props.page - 1]);
    }
  };

  useEffect(() => {
    if (props.onHandleBack) {
      props.onHandleBack(handleBack);
    }
  }, [props, handleBack])
  

  return (
    <footer className={classes.wrapper}>
      <FormProgressBar page={props.page}/>
      <div className={classes.container}>
        <div classes={classes.left}>
          <button className={classes.leftbutton} type="button" onClick={handleBack}>
            Back
          </button>
        </div>
        <div>
          <button className={classes.nextbutton + (props.canGoNext ? "" : ` ${classes.disabled}`)} type="submit" disabled={!props.canGoNext}>Next</button>
        </div>
      </div>
    </footer>
  );
}

export default BottomBar;
