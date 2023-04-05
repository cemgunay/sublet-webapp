import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../api/axios";
import AmenityList from "../../components/List/AmenityList";
import BottomBar from "../../components/List/BottomBar";

import classes from "./Amenities.module.css";

function Amenities() {
  const {
    urlTitleReverse,
    page,
    setPage,
    data,
    setData,
    handleChange,
    currentUserId,
    canGoNext,
    loading,
  } = useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUrl = window.location.pathname;
    const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
    setPage((prev) => prev + 1);
    navigate(newUrl + "/" + urlTitleReverse[page + 1]);

    const { _id, ...updateData } = data;

    try {
      await api.put("/listings/" + data._id, updateData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.title}>
          <div>Step 2</div>
          <div>Make your place stand out</div>
          <div>
            In this step, you'll add some of the amenities your place offers,
            plus 3 or more photos. Then, you'll create a title and description.
          </div>
        </div>
        <div className={classes.image}>
          <img
            src="\List\lat2_sehq_201007 1.png"
            alt="\List\lat2_sehq_201007 1.png"
          />
        </div>
      </div>
      <div>
            What amenities you got blud?
          </div>
      <form id="amenities" onSubmit={handleSubmit}>
        {loading ? (
          <div>Holdup</div>
        ) : (
          <div className={classes.content}>
            <AmenityList data={data} handleChange={handleChange} />
            <BottomBar
              form={urlTitleReverse[page]}
              page={page}
              setPage={setPage}
              urlTitleReverse={urlTitleReverse}
              listId={data._id}
              currentUserId={currentUserId}
              data={data}
              setData={setData}
              canGoNext={canGoNext}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Amenities;
