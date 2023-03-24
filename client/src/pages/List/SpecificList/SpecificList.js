import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../../../components/List/TopBar";
import useListFormContext from "../../../hooks/useListFormContext";

function SpecificList() {

  const { urlTitle, urlTitleReverse, page, setPage, data, setData, canSubmit, handleChange, currentUserId, loading } = useListFormContext()

  //to iterate through pages
  const currentUrl = window.location.pathname
  const n = currentUrl.lastIndexOf('/')
  const result = currentUrl.substring(n + 1)

  useEffect(() => {
    setPage(urlTitle[result]);
  });

  /*
to figure out what page we are on after a save and exit:

call to the listing api of specific listing to see the FIRST field that is empty
get the name of field
use reverse hashmap to get page number from there
then the back and next buttons will 

this will also help if person refreshes in the middle of the process so it will default redirect to last saved field

*/

  return (
    <>
      <TopBar />
      <Outlet context={[urlTitle, urlTitleReverse, page, setPage, data, setData, canSubmit, handleChange, currentUserId, loading]}/>
    </>
  );
}

export default SpecificList;
