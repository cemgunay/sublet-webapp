import React from "react";
import { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

import { useSearchParams } from "react-router-dom";

const RequestFormContext = createContext({});

export const RequestFormProvider = ({ children }) => {
  //get current logged in user
  const { user: currentUser } = useContext(AuthContext);
  const currentUserId = currentUser._id;

  //to get dates
  const [searchParams] = useSearchParams();
  const startDateFromURL = searchParams.get("startDate");
  const endDateFromURL = searchParams.get("endDate");
  const viewingDateFromURL = searchParams.get("viewingDate");
  const priceFromURL = searchParams.get("price");

  //form data that will be posted
  const [data, setData] = useState({
    tenantId: "",
    subTenantId: currentUserId,
    listingId: "",
    price: priceFromURL ? parseFloat(priceFromURL) : 0,
    startDate: startDateFromURL ? startDateFromURL : null,
    endDate: endDateFromURL ? endDateFromURL : null,
    viewingDate:
      viewingDateFromURL && viewingDateFromURL !== "null"
        ? viewingDateFromURL
        : null,
  });

  console.log(data);

  //to handle change of the inputs in all the forms
  const handleChange = (e) => {
    if (e.target) {
      const type = e.target.type;
      const name = e.target.name;
      const value = type === "checkbox" ? e.target.checked : e.target.value;

      if (name === "price") {
        const withouDollarSignValue = value.replace(/^\$/, "");
        const numberValue = parseInt(withouDollarSignValue);
        if (!isNaN(numberValue)) {
          setData((prevData) => ({
            ...prevData,
            [name]: numberValue,
          }));
        } else {
          setData((prevData) => ({
            ...prevData,
            [name]: 0, // Set an empty string or any default value for price when it's not a valid number
          }));
        }
      } else {
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  return (
    <RequestFormContext.Provider
      value={{
        data,
        setData,
        handleChange,
        currentUserId,
      }}
    >
      {children}
    </RequestFormContext.Provider>
  );
};

export default RequestFormContext;
