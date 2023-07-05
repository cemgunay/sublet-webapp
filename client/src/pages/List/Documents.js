import React from 'react'
import { useOutletContext, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import BottomBar from '../../components/List/BottomBar';

function Documents() {

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
    <div>Documents
        <form id="documents" onSubmit={handleSubmit} >
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
  )
}

export default Documents