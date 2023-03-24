import React from "react";
import { useNavigate } from "react-router-dom";

import api from '../../api/axios'

import classes from "./BottomBar.module.css";

function BottomBar(props) {
  const navigate = useNavigate();

  const handleBack = async () => {
    if (props.page === 0) {

      const user = {
        userId: props.currentUserId,
      };

      try {
          await api.delete("/listings/" + props.listId + "/" + user.userId);
          
          //also remove from local stora
          localStorage.setItem("listId", JSON.stringify(""))
      } catch (err) {
          console.log(err)
      }
      navigate("/list/overview");

    } else {

      const currentUrl = window.location.pathname;
      const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
      props.setPage((prev) => prev - 1);
      navigate(newUrl + "/" + props.urlTitleReverse[props.page - 1]);

    }
  };

  return (
    <footer className={classes.wrapper}>
      <div className={classes.container}>
        <div classes={classes.left}>
          <button type="button" onClick={handleBack}>
            Back
          </button>
        </div>
        <div>
          <button type="submit">
            Next
          </button>
        </div>
      </div>
    </footer>
  );
}

export default BottomBar;
