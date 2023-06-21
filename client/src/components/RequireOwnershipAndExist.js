import { createFilterOptions } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireOwnershipAndExist = ({
  children,
  checkOwnership,
  checkExistence, // new prop for existence check
  paramName = "id",
  additionalParamName = "listingId",
  redirectPath = (id) => "/not-authorized",
}) => {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [checkPassed, setCheckPassed] = useState(null);

  const id = params[paramName];
  const listingId = params[additionalParamName];

  useEffect(() => {
    let checkPromise;

    if (checkExistence) {
      // If checkExistence is provided, use it
      if (listingId) {
        checkPromise = checkExistence(currentUser, listingId);
      } else {
        console.log('here')
        checkPromise = checkExistence(currentUser, id);
      }
    } else if (checkOwnership) {
      // If checkOwnership is provided, use it
      checkPromise = checkOwnership(currentUser, id, listingId);
    }

    if (checkPromise) {
      checkPromise
        .then((result) => {
          setCheckPassed(result);
          if (!result) {
            navigate(redirectPath(id));
          }
        })
        .catch((error) => {
          console.error("Error caught in useEffect:", error);
          if (
            error.message === "Request not found" ||
            error.message === "Listing not found" ||
            error.message === "Mismatched listingId" ||
            error.message === "Conversation not found"
          ) {
            navigate("/not-found");
          } else if (error.message === "Not authorized") {
            navigate(redirectPath(id));
          } else if (error.message === "Listing not published"){
            navigate("/not-published");
          }
        });
    }
  }, [
    checkOwnership,
    checkExistence,
    currentUser,
    id,
    listingId,
    navigate,
    redirectPath,
  ]);

  if (checkPassed === null) {
    return null;
  }

  return children;
};

export default RequireOwnershipAndExist;
