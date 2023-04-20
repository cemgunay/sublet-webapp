import React, {useState, useEffect} from 'react'
import api from "../../api/axios";
import { useLocation, useParams } from 'react-router-dom';

function Request() {

  const { listing_id, request_id } = useParams();
  const location = useLocation();
  const { state } = location;
  const [listing, setListing] = useState(null);
  const [data, setData] = useState(null)

  //if there is no state, take listing from parameters
  useEffect(() => {
    if (!state) {
      api.get("/listings/" + listing_id).then((response) => {
        setListing(response.data);
      });
    } else {
      setListing(state.listing);
    }
  }, [listing_id, state]);

//if there is no state, take lrequest from parameters
useEffect(() => {
  if (!state) {
    api.get("/requests/" + request_id).then((response) => {
      setData(response.data);
    });
  } else {
    setData(state.data);
  }
}, [request_id, state]);



  console.log(data)
  console.log(listing)
  
  return (
    <div>Request</div>
  )
}

export default Request