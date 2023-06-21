import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";

import api from "../../api/axios";

import classes from "./Basics.module.css";
import IncrementalInput from "../../components/List/IncrementalInput";
import BedroomList from "../../components/List/BedroomList";
import IncrementalInputField from "../../components/Util/IncrementalInputField";

function Basics() {
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
    setBackButtonClicked
  } = useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    setBackButtonClicked(true);

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
        <div>Basics</div>
        <div>You can add more detail later, like bed types</div>
      </div>
      <div className={classes.content}>
        <form id="basics" onSubmit={handleSubmit}>
          {loading ? (
            <div>Holdup</div>
          ) : (
            <>
              <div className={classes.inputs}>
                <div className={classes.inputfield}>
                  <div>Bedrooms</div>
                  <IncrementalInputField
                    data={data}
                    setData={setData}
                    type="bedrooms"
                  />
                </div>
                <div className={classes.inputfield}>
                  <div>Bathrooms</div>
                  <IncrementalInputField
                    data={data}
                    setData={setData}
                    type="bathrooms"
                  />
                </div>
              </div>
              <BedroomList data={data} setData={setData} />
            </>
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
      </div>
    </div>
  );
}

export default Basics;
