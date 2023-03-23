import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BottomBar from "../../components/List/BottomBar";
import api from '../../api/axios'

function Location() {

  const navigate = useNavigate()

  const [urlTitle, urlTitleReverse, page, setPage, data, canSubmit, handleChange, currentUserId]  = useOutletContext();
  
  const handleSubmit = async (e) => {

    e.preventDefault();

    navigate('/list/overview');

    const {_id, ...updateData} = data

    try {
        await api.put("/listings/" + data._id, updateData);

    } catch (err) {
        console.log(err)
    }

    //setData

    //increase page number

    console.log("submitted!");
  };

  return (
    <div>
      <form id="location" onSubmit={handleSubmit}>
        <div>location</div>
        <input type="address" placeholder="address" name="address" value={data.address} required onChange={handleChange}/>
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

export default Location;
