import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Outlet, useLocation, useOutlet } from "react-router-dom";
import TopBar from "../../../components/List/TopBar";
import useListFormContext from "../../../hooks/useListFormContext";

import classes from "./SpecificList.module.css";

function SpecificList() {
  const {
    urlTitle,
    urlTitleReverse,
    page,
    setPage,
    data,
    setData,
    canSubmit,
    handleChange,
    currentUserId,
    loading,
    canGoNext,
    setCanGoNext,
  } = useListFormContext();

  const [handleBack, setHandleBack] = useState(null);

  const outlet = useOutlet();
  const context = useMemo(
    () => ({
      ...outlet.context,
      onHandleBack: setHandleBack,
    }),
    [outlet.context, setHandleBack]
  );

  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      if (handleBack) {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleBack]);

  const navigate = useNavigate();

  // Re-run the effect when the location changes
  useEffect(() => {
    if (handleBack) {
      handleBack();
    }

    if (location.pathname.endsWith("aboutyourplace")) {
      if (!data._id) {
        navigate("/host/list/overview");
      }
    }
  }, [location, handleBack, data._id, navigate]);

  //to iterate through pages
  const currentUrl = window.location.pathname;
  const n = currentUrl.lastIndexOf("/");
  const result = currentUrl.substring(n + 1);

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
    <div className={classes.container}>
      <TopBar />
      <div className={classes.outlet}>
        <Outlet
          context={{
            urlTitle,
            urlTitleReverse,
            page,
            setPage,
            data,
            setData,
            canSubmit,
            handleChange,
            currentUserId,
            loading,
            canGoNext,
            setCanGoNext,
            onHandleBack: setHandleBack,
          }}
        />
      </div>
    </div>
  );
}

export default SpecificList;
