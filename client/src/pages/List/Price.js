import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import BottomBar from "../../components/List/BottomBar";
import IncrementalInput from "../../components/List/IncrementalInput";
import UtilityList from "../../components/List/UtilityList";

import classes from "./Price.module.css";

function Price() {
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
          <div>Step 4</div>
          <div>Finish up and publish</div>
          <div>
            Finally, you’ll set your monthly price and answer a few quick
            questions and publish when you’re ready.
          </div>
        </div>
        <div className={classes.image}>
          <img
            src="\List\si4x_wafz_200928 1.png"
            alt="\List\si4x_wafz_200928 1.png"
          />
        </div>
      </div>
      <div>Set your price</div>
      <div>You can change it anytime</div>
      <form id="price" onSubmit={handleSubmit}>
        <div className={classes.content}>
          <div className={classes.pricecontainer}>
            <div className={classes.pricecontroller}>
              <IncrementalInput
                data={data}
                setData={setData}
                type="price"
                handleChange={handleChange}
              />
            </div>
            <div>
              Sublets like yours in your area usually range from $1000 to $1200.
              (based on location, amenities, nearby prices, and demand)
            </div>
          </div>
          <div className={classes.utilitiescontainer}>
            <div>
                What's be gwanin in da pryce?
            </div>
            <div className={classes.utilities}>
                <UtilityList data={data} handleChange={handleChange} />
            </div>
          </div>
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
      </form>
    </div>
  );
}

export default Price;
