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
    setBackButtonClicked
  } = useOutletContext();

  const navigate = useNavigate()

  const [count, setCount] = useState(data.title.length || 0);

  useEffect(() => {
    setCount(data.title.length)
  }, [data.title])
  

  const handleOnChange = (e) => {
    e.preventDefault();

    setCount(e.target.value.length);

    handleChange(e)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setBackButtonClicked(true);

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
        <div>Now, let’s give your subLet a title</div>
        <div>Short titles work best. You can always change this later</div>
      </div>
      <div>
        <form id="title" onSubmit={handleSubmit} className={classes.form}>
          <input
            className={classes.rectangle}
            type="textarea"
            name="title"
            value={data.title || ""}
            onChange={handleOnChange}
          />
          <div className={classes.counter}>{count}/32</div>
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
