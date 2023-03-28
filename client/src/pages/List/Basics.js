import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";

import api from '../../api/axios'

import classes from './Basics.module.css'

function Basics() {

  const {urlTitleReverse, page, setPage, data, handleChange, currentUserId}  = useOutletContext();

  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const currentUrl = window.location.pathname;
    const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
    setPage((prev) => prev + 1);
    navigate(newUrl + "/" + urlTitleReverse[page + 1]);

    const {_id, ...updateData} = data

    try {
        await api.put("/listings/" + data._id, updateData);

    } catch (err) {
        console.log(err)
    }

  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>Basics</div>
        <div>You can add more detail later, like bed types</div>
      </div>
      <form id="Basics" onSubmit={handleSubmit}>
        <div>
        <input type="text" placeholder="title" name="title" value={data.title} required onChange={handleChange}/>
        <input type="text" placeholder="title" name="title" value={data.title} required onChange={handleChange}/>
        <input type="text" placeholder="title" name="title" value={data.title} required onChange={handleChange}/>
        </div>
        <BottomBar
          form={urlTitleReverse[page]}
          page={page}
          setPage={setPage}
          urlTitleReverse={urlTitleReverse}
          listId={data._id}
          currentUserId={currentUserId}
          data={data}
        />
      </form>
    </div>
  );
}

export default Basics;
