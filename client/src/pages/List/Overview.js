import React, { useContext } from "react";
import { useState } from "react";
import OverviewCards from "../../components/List/OverviewCards";
import BottomButton from "../../components/UI/BottomButton";
import TopBack from "../../components/UI/TopBack";

import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import classes from './Overview.module.css'
import useListFormContext from "../../hooks/useListFormContext";

function Overview() {

  const { data, setData } = useListFormContext();

  const navigate = useNavigate();

  console.log(data.userId)

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    console.log(data);

    const newListing = {
      userId: data.userId,
      expiryDate: data.expiryDate
    };

    api.post('/listings', newListing)
    .then(response => {
      console.log(response.data._id)
      setData({...data, _id: response.data._id})
      navigate('/list/'+response.data._id+'/aboutyourplace')
    })
    .catch(error => console.error(error));
}

  return (
    <>
      <TopBack icon="xmark" />
      <div className={classes.container}>
        <div>Its easy to get started with subLet</div>
        <div className={classes.cards}>
          <OverviewCards
            number={1}
            title="Tell us about your place"
            desc="Share some basic info, like where it is and how many bedroom, beds there are"
            img='\List\fl8k_gupv_200928_ss4mp_generated 1 (1).png'
          />
          <OverviewCards
            number={2}
            title="Make it stand out"
            desc="Add 3 or more photos plus a title and description"
            img='\List\image 1.png'
          />
          <OverviewCards
            number={3}
            title="Get your documents ready"
            desc="Upload all required documents for the sublet. Don’t worry, you can always add later"
            img='\List\lat2_sehq_201007 1.png'
          />
          <OverviewCards
            number={4}
            title="Finish up and publish"
            desc="Set a price and publish your subLet"
            img='\List\si4x_wafz_200928 1.png'
          />
        </div>
      </div>
      <BottomButton text="Get Started" onClick={handleOnSubmit}/>
    </>
  );
}

export default Overview;