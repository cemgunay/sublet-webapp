import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";

import api from "../../api/axios";

import classes from "./Title.module.css";

function Title() {
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

  const navigate = useNavigate()

  const [count, setCount] = useState(data.description.length || 0);

  useEffect(() => {
    setCount(data.description.length)
  }, [data.description])

  const handleOnChange = (e) => {
    e.preventDefault();

    setCount(e.target.value.length);

    handleChange(e)
  };

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
        <div>Create your description</div>
        <div>Share any extra details here</div>
      </div>
      <div>
        <form id="description" onSubmit={handleSubmit} className={classes.form}>
          <input
            className={classes.rectangle}
            type="textarea"
            name="description"
            value={data.description || ""}
            onChange={handleOnChange}
          />
          <div className={classes.counter}>{count}/200</div>
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

export default Title;