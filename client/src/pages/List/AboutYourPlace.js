import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";

import classes from "./AboutYourPlace.module.css";

import api from "../../api/axios";

function AboutYourPlace() {

  const {
    urlTitleReverse,
    page,
    setPage,
    data,
    setData,
    handleChange,
    currentUserId,
    loading,
    canGoNext
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

  //for property type radio buttons
  const checkedPropertyType = data.aboutyourplace.propertyType

  //for privacy type radio buttons
  const checkedPrivacyType = data.aboutyourplace.privacyType
  

  return (
    <>
      <form id={urlTitleReverse[page]} onSubmit={handleSubmit}>
        {loading ? (
          <div>holdup</div>
        ) : (
          <div className={classes.container}>
            <div className={classes.header}>
              <div className={classes.title}>
                <div>Step 1</div>
                <div>Tell us about your place</div>
                <div>
                  In this step, we’ll ask you which type of property you have
                  and if guests will book the entire place or just a room. Then
                  let us know the location and number of bedrooms and beds
                </div>
              </div>
              <div className={classes.image}>
                <img
                  src="\List\fl8k_gupv_200928_ss4mp_generated 1 (1).png"
                  alt="\List\fl8k_gupv_200928_ss4mp_generated 1 (1).png"
                />
              </div>
            </div>
            <div className={classes.propertytype}>
              <input
                id="house"
                name="propertyType"
                type="radio"
                value="house"
                checked={checkedPropertyType === "house"}
                onChange={handleChange}
                required
              />
              <label className={classes.propertytypeselection} htmlFor="house">
                House
              </label>
              <input
                id="apartment"
                name="propertyType"
                type="radio"
                value="apartment"
                checked={checkedPropertyType === "apartment"}
                onChange={handleChange}
              />
              <label
                className={classes.propertytypeselection}
                htmlFor="apartment"
              >
                Apartment
              </label>
              <input
                id="dorm"
                name="propertyType"
                type="radio"
                value="dorm"
                checked={checkedPropertyType === "dorm"}
                onChange={handleChange}
              />
              <label className={classes.propertytypeselection} htmlFor="dorm">
                Dorm
              </label>
              <input
                id="townhouse"
                name="propertyType"
                type="radio"
                value="townhouse"
                checked={checkedPropertyType === "townhouse"}
                onChange={handleChange}
              />
              <label
                className={classes.propertytypeselection}
                htmlFor="townhouse"
              >
                Townhouse
              </label>
            </div>
            <div className={classes.privacy}>
              <input
                id="entire"
                name="privacyType"
                type="radio"
                value="entire"
                checked={checkedPrivacyType === "entire"}
                onChange={handleChange}
                required
              />
              <label className={classes.privacytype} htmlFor="entire">
                <div className={classes.privacyleft}>
                  <div>An entire place</div>
                  <div>Subtenants have the whole place to themselves</div>
                </div>
                <div>Img</div>
              </label>
              <input
                id="private"
                name="privacyType"
                type="radio"
                value="private"
                checked={checkedPrivacyType === "private"}
                onChange={handleChange}
              />
              <label className={classes.privacytype} htmlFor="private">
                <div className={classes.privacyleft}>
                  <div>A private Room</div>
                  <div>Subtenants have a private room but some areas are shared with others</div>
                </div>
                <div>Img</div>
              </label>
              <input
                id="shared"
                name="privacyType"
                type="radio"
                value="shared"
                checked={checkedPrivacyType === "shared"}
                onChange={handleChange}
              />
              <label className={classes.privacytype} htmlFor="shared">
                <div className={classes.privacyleft}>
                  <div>A shared room</div>
                  <div>Subtenants share a bedroom</div>
                </div>
                <div>Img</div>
              </label>
            </div>
          </div>
        )}
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
      </form>
    </>
  );
}

export default AboutYourPlace;

/*



            <input
              type="text"
              placeholder="title"
              name="title"
              value={data.title || ""}
              required
              onChange={handleChange}
            />

*/
