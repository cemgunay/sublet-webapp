import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";

import api from '../../api/axios'

function Basics() {

  const [urlTitle, urlTitleReverse, page, setPage, data, canSubmit, handleChange, currentUserId]  = useOutletContext();

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
    <div>
      <form id="Basics" onSubmit={handleSubmit}>
        <div>Basics</div>
        <input type="text" placeholder="title" name="title" value={data.title} required onChange={handleChange}/>
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
