import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import MonthGrid from "../../components/Util/MonthGrid";
import { TextField } from "@mui/material";
import IncrementalInputField from "../../components/Util/IncrementalInputField";
import useRequestFormContext from "../../hooks/useRequestFormContext";

import classes from "./Request.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faMessage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import BottomBlock from "../../components/UI/BottomBlock";

import { Modal, Box, Button } from "@mui/material";
import { toast } from "react-toastify";

import { v4 as uuid } from "uuid";
import { CSSTransition } from "react-transition-group";
import AcceptModalWithSpinner from "../../components/Request/AcceptModal";
import useAuth from "../../hooks/useAuth";

import ClipLoader from "react-spinners/ClipLoader";

function Request() {
  //from URL
  const { listingId, requestId } = useParams();

  //for loading screen
  const [loading, setLoading] = useState(false);

  //if state was passed from previous location
  const location = useLocation();
  const { state } = location;

  const [listing, setListing] = useState(null);

  //from context
  const { data, setData, handleChange } = useRequestFormContext();

  //to set the initial dates for MonthGrid
  const [defaultMoveInDate, setDefaultMoveInDate] = useState(null);
  const [defaultMoveOutDate, setDefaultMoveOutDate] = useState(null);

  //to set the initial price
  const [originalPrice, setOriginalPrice] = useState(data.price);
  //to set the initial price
  const [originalMoveInDate, setOriginalMoveInDate] = useState(data.startDate);
  //to set the initial price
  const [originalMoveOutDate, setOriginalMoveOutDate] = useState(data.endDate);
  //to set the inital viewing date
  const [originalViewingDate, setOriginalViewingDate] = useState(
    data.viewingDate
  );

  //to handle rescind modals
  const [showRescindModal, setShowRescindModal] = useState(false);

  //to handle accept modal
  const [openAcceptModal, setOpenAcceptModal] = useState(false);

  //to handle delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //to handle reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);

  //for file upload
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [uploadProgressAgreement, setUploadProgressAgreement] = useState(0);
  const [selectedGovId, setSelectedGovId] = useState(null);
  const [uploadProgressGovId, setUploadProgressGovId] = useState(0);

  //for disabling accept button
  const [canAccept, setCanAccept] = useState(false);

  //current user
  const { user: currentUser, role, dispatch } = useAuth();

  //conversation
  const [conversation, setConversation] = useState(null);

  console.log(currentUser);

  //check if user trying to put request is currently in transaction
  const subtenantIsInTransaction = currentUser.currentSubTenantTransaction;

  //check and give a warning if listing is already in transaction
  const [listingIsInTransaction, setListingIsInTransaction] = useState(false);

  //check if there is a more recent request by user on the same listing
  const [mostRecentRequest, setMostRecentRequest] = useState(null);

  console.log("BUDDDDDD");

  //On refresh, get listing and tenant id from DB, and set if listingIsInTransaction
  useEffect(() => {
    api
      .get("/listings/" + listingId)
      .then((response) => {
        console.log(response.data);
        setListing(response.data);
        setData((prevData) => ({
          ...prevData,
          listingId: listingId,
          tenantId: response.data.userId,
        }));

        if (response.data.transactionInProgress) {
          setListingIsInTransaction(true);
        }
      })
      .catch((error) => console.error(error));
  }, [listingId, setData]);

  //if coming from sublets, get request status + id from DB (Basically just checks if requestId parameter exists in database)
  useEffect(() => {
    api
      .get("/requests/" + requestId)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setOriginalMoveInDate(response.data.startDate);
        setOriginalMoveOutDate(response.data.endDate);
        setOriginalPrice(response.data.price);
        setOriginalViewingDate(response.data.viewingDate);
      })
      .catch((error) => console.error(error));
  }, [requestId, setData]);

  //when startDate and endDate change update URL
  const navigate = useNavigate();

  console.log(data);

  useEffect(() => {
    navigate(
      `?startDate=${data.startDate}&endDate=${data.endDate}&viewingDate=${data.viewingDate}&price=${data.price}`,
      { replace: true }
    );
  }, [data.startDate, data.endDate, data.viewingDate, data.price, navigate]);

  //if there is no state, take listing from parameters
  useEffect(() => {
    if (!state) {
      api.get("/listings/" + listingId).then((response) => {
        setListing(response.data);
        setDefaultMoveInDate(response.data.moveInDate);
        setDefaultMoveOutDate(response.data.moveOutDate);
      });
    } else {
      setListing(state.listing);
      setDefaultMoveInDate(state.listing.moveInDate);
      setDefaultMoveOutDate(state.listing.moveOutDate);
    }
  }, [listingId, state]);

  //handle changing the vieweing date
  const handleOnChangeViewing = (date) => {
    //const formattedDate = date.toISOString(); //can do this if we want formatted viewing dates

    setData((prevData) => ({
      ...prevData,
      viewingDate: date,
    }));
  };

  const shouldDisableDate = (date) => {
    if (!listing.viewingDates || !date) return true;
    const isoDates = listing.viewingDates.map((d) =>
      dayjs(d).format("YYYY-MM-DD")
    );
    return !isoDates.includes(dayjs(date).format("YYYY-MM-DD"));
  };

  //for changing the subLet dates
  const handleDataChange = useCallback(
    ({ startDate, endDate }) => {
      setData((prevData) => ({
        ...prevData,
        startDate: startDate,
        endDate: endDate,
      }));
    },
    [setData]
  );

  // to get the conversation
  const getChat = async (requestId) => {
    try {
      const res = await api.get("/conversations/request/" + requestId);
      setConversation(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (requestId) {
      getChat(requestId);
    }
  }, [requestId]);

  //to get the month name from ISO
  const getMonth = (date) => {
    const dateToChange = new Date(date);
    const options = { month: "short", year: "numeric" };
    const monthYearString = dateToChange.toLocaleDateString("en-US", options);
    return monthYearString;
  };

  //to format date
  function formatDate(dateString) {
    if (!dateString) {
      return "No viewing date selected";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString();
  }

  //to get the difference between in months between two ISO
  const getMonthDiff = (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const diffInMs = Math.abs(date2 - date1); // absolute difference in milliseconds
    const avgMsInMonth = 1000 * 60 * 60 * 24 * 30.44; // average milliseconds in a month
    const diffInMonths = Math.round(diffInMs / avgMsInMonth); // round to nearest integer
    return diffInMonths;
  };

  //for the totals to be displayed
  const subTotal = parseFloat(
    (data.price * getMonthDiff(data.startDate, data.endDate)).toFixed(2)
  );
  const atic = parseFloat((data.price * 2 * 0.04).toFixed(2));

  const total = (subTotal + atic).toFixed(2);
  const due = subTotal / 2 + atic;

  //to go back
  const goBack = () => {
    navigate(-1);
  };

  //go to listing when clicked
  const goToListing = (e) => {
    e.preventDefault();

    navigate("/listing/" + listingId);
  };

  //fetch more recent request
  const fetchRecentRequest = async (e) => {
    api
      .get(`/requests/listing/most-recent/${listingId}/${currentUser._id}`)
      .then((response) => {
        const recentRequest = response.data;

        console.log(recentRequest);

        if (recentRequest && recentRequest._id !== data._id) {
          setMostRecentRequest(recentRequest._id);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          goToNewRequest();
        } else {
          console.error("An error occured: ", error);
        }
      });
  };

  //go to more recent request
  const goToRecentRequest = async (e) => {
    e.preventDefault();

    navigate(`/listing/${listingId}/request/${mostRecentRequest}`);
  };

  //if offer is rejected, create new request when user clicks button
  const goToNewRequest = async (e) => {
    e.preventDefault();

    const id = uuid(); // generate a random UUID for URL

    setData((prevData) => ({
      ...prevData,
      startDate: listing.moveInDate,
      endDate: listing.moveOutDate,
      viewingDate: null,
      price: listing.price,
      status: null,
      status_reason: null,
    }));

    navigate(
      `/listing/${listingId}/request/${id}/new?startDate=${
        listing.moveInDate
      }&endDate=${listing.moveOutDate}&viewingDate=${null}&price=${
        listing.price
      }`,
      {
        state: { stateData: data, listing },
      }
    );
  };

  //to place a request
  const handleRequest = async (e) => {
    e.preventDefault();

    setLoading(true);

    const viewingDate = data.viewingDate;

    const newRequest = {
      tenantId: data.tenantId,
      subTenantId: data.subTenantId,
      listingId: data.listingId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
      viewingDate: data.viewingDate,
    };

    api
      .post("/requests/" + listing._id, newRequest)
      .then((response) => {
        console.log(response.data);
        toast.success("Your request has been submitted.");
        navigate("/sublets");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error, can't submit request, please try again later");
        console.error(error);
        setLoading(false);
      });
  };

  //to decline a counter offer
  const handleDecline = (e) => {

    setLoading(true);

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: data.tenantId,
      status: "rejected",
      status_reason: "Counter offer has been rejected",
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        setData((prevData) => ({
          ...prevData,
          status: "rejected",
          status_reason: "Counter offer has been rejected",
        }));
        toast.success("The counter offer has been rejected");
        setShowRejectModal(false);
        navigate("/sublets/past");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(
          "Error, can't decline counter offer, please try again later"
        );
        console.error(error);
        setLoading(false);
      });
  };

  //opens rescind modal
  const handleRescind = (e) => {
    e.preventDefault();
    setShowRescindModal(true);
  };

  //confirm the rescind operation in the modal
  const handleRescindModalConfirm = () => {
    // Perform the rescind operation here, then close the modal
    console.log(data._id);
    setLoading(true);
    api
      .delete("/requests/delete/" + data._id, {
        data: { userId: currentUser._id },
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Your request has been successfully rescinded.");
        navigate("/sublets");
        setShowRescindModal(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error, can't rescind request, please try again later");
        console.error(error);
        setLoading(false);
      });
  };

  // Just close the rescind modal
  const handleRescindModalCancel = () => {
    setShowRescindModal(false);
  };

  //opens reject modal
  const handleReject = (e) => {
    e.preventDefault();
    setShowRejectModal(true);
  };

  //confirm the reject operation in the modal
  const handleRejectModalConfirm = () => {
    // Perform the reject operation here, then close the modal
    handleDecline();
  };

  // Just close the reject modal
  const handleRejectModalCancel = () => {
    setShowRejectModal(false);
  };

  //Update the request while it is pending tenant
  const handleUpdate = (e) => {
    e.preventDefault();

    setLoading(true);

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: data.tenantId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "pendingTenant",
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        toast.success("Your request has been updated.");
        navigate("/sublets/active");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error, can't update request, please try again later");
        console.error(error);
        setLoading(false);
      });
  };

  //Counter tenants counter offer
  const handleCounter = (e) => {
    e.preventDefault();

    setLoading(true);

    const updateRequest = {
      subTenantId: data.subTenantId,
      tenantId: data.tenantId,
      price: data.price,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "pendingTenant",
      subtenantDocuments: [],
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        toast.success("The offer has been countered");
        navigate("/sublets/active/");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error, can't counter offer, please try again later");
        console.error(error);
        setLoading(false);
      });
  };

  //Open delete modal to delete past/expired request
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  //confirm deletion of past request
  const handleDeleteConfirm = () => {
    setLoading(true);

    const updateRequest = {
      showSubTenant: false,
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        toast.success("Past request deleted successfully");
        navigate("/sublets/past");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to delete past request: " + error.message);
        setLoading(false);
        console.error(error);
      });

    setShowDeleteModal(false);
  };

  //cancel and close delete modal
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  //open accept counter modal
  const handleAccept = () => {
    setOpenAcceptModal(!openAcceptModal);
  };

  //accept the counter offer
  const handleAcceptConfirm = async () => {
    console.log("running accept confirm");

    setLoading(true);

    try {
      const response = await api.put(
        "/requests/acceptAsSubTenant/" + requestId,
        null,
        {
          headers: {
            //Send user ID in headers
            "x-user-id": currentUser._id,
          },
        }
      );

      // To update user in local storage
      const updatedUserResponse = await api.get("/users/id/" + currentUser._id);
      const updatedUser = updatedUserResponse.data;
      dispatch({ type: "UPDATE_USER", payload: updatedUser });

      navigate("/sublets/active");
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error(error);
      setLoading(false);
      throw error;
    }
  };

  //for file agreement upload
  const handleFileUploadAgreement = () => {
    const formData = new FormData();

    const documentType = "Sublet Agreement";

    formData.append("file", selectedAgreement);
    formData.append("user", JSON.stringify(currentUser));
    formData.append("requestId", data._id);
    formData.append("documentType", documentType);
    formData.append("role", role);

    api
      .post("/uploads/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgressAgreement(percentCompleted);
        },
      })
      .then((response) => {
        console.log(response);
        // Fetch the updated request details after successful upload
        api.get("/requests/" + requestId).then((response) => {
          setData(response.data);
        });
        setUploadProgressAgreement(0);
        setSelectedAgreement(null);
      })
      .catch((error) => {
        console.log(error);
        setUploadProgressAgreement(0);
        setSelectedAgreement(null);
      });
  };

  //for file govid upload
  const handleFileUploadGovId = () => {
    const formData = new FormData();

    const documentType = "Government ID";

    formData.append("file", selectedGovId);
    formData.append("user", JSON.stringify(currentUser));
    formData.append("requestId", data._id);
    formData.append("documentType", documentType);
    formData.append("role", role);

    api
      .post("/uploads/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgressGovId(percentCompleted);
        },
      })
      .then((response) => {
        console.log(response);

        // Fetch the updated request details after successful upload
        api.get("/requests/" + requestId).then((response) => {
          console.log(response.data);
          setData(response.data);
        });
        setUploadProgressGovId(0);
        setSelectedGovId(null);
      })
      .catch((error) => {
        console.log(error);
        setUploadProgressGovId(0);
        setSelectedGovId(null);
      });
  };

  //for file download
  const handleFileDownload = (fileName) => {
    // Find the Sublet Agreement document in the tenant's documents
    const document = data.tenantDocuments.find(
      (document) => document.type === "Sublet Agreement"
    );

    console.log(document);

    if (!document) {
      console.error("No Government ID document found for tenant");
      return;
    }

    api
      .get("/uploads/download/" + document.fileName)
      .then((response) => {
        console.log(response);
        const url = response.data.url;

        // Redirect the user to the pre-signed URL to initiate the download
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //for file delete
  const handleFileDelete = async (documentId) => {
    try {
      const response = await api.delete("/uploads/delete/" + documentId);
      console.log(response.data);
      toast.success("The file has been deleted");

      // Remove the deleted document from the request state
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("There was an error deleting the file, try again");
    }
  };

  console.log(currentUser);

  //to set accept button to disabled or not
  useEffect(() => {
    if (data.status === "pendingSubTenant") {
      if (
        data.subtenantDocuments.filter((doc) => doc.type === "Government ID")
          .length > 0
      ) {
        setCanAccept(true);
      } else {
        setCanAccept(false);
      }
    } else if (data.status === "pendingFinalAccept") {
      if (data.subtenantFinalAccept) {
        setCanAccept(false);
      } else {
        setCanAccept(true);
      }
    } else {
      setCanAccept(false);
    }
  }, [data.status, data.subtenantDocuments]);

  //handle accepting after all docs have been uploaded (FINAL GANG)
  const handleFinalAccept = async () => {
    setLoading(true);

    console.log("running final confirm");
    api
      .post(
        "/requests/confirm/" + data._id,
        { role },
        {
          headers: {
            "x-user-id": currentUser._id,
          },
        }
      )
      .then((response) => {
        console.log(response);

        // Check if response.data has a 'message' property
        if (!response.data.message) {
          setData(response.data);
        }

        // To update user in local storage
        api
          .get("/users/id/" + currentUser._id)
          .then((response) => {
            console.log(response);
            dispatch({ type: "UPDATE_USER", payload: response.data });

            if (
              currentUser.currentSubTenantTransaction !==
              response.data.currentSubTenantTransaction
            ) {
              navigate("/sublets/confirmed");
            }
          })
          .catch((err) => {
            console.error(err);
          });

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <div className={classes.loadingcontainer}>
          <ClipLoader
            color={"#61C0BF"}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <div className={classes.headercontainer}>
            {data.status === "rejected" ? (
              <div className={classes.header}>
                <div className={classes.back} onClick={goBack}>
                  <FontAwesomeIcon icon={faCircleChevronLeft} />
                </div>
                <div>Request to subLet</div>
                <div className={classes.deleteiconcontainer}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    onClick={handleDeleteClick}
                  />
                </div>
              </div>
            ) : (
              <div className={classes.header}>
                <div className={classes.back} onClick={goBack}>
                  <FontAwesomeIcon icon={faCircleChevronLeft} />
                </div>
                <div>Request to subLet</div>
                {conversation ? (
                  <Link
                    to={`/inbox/${conversation?._id}`}
                    style={{ color: "inherit" }}
                    className={classes.chat}
                  >
                    <FontAwesomeIcon
                      icon={faMessage}
                      className={classes.chaticon}
                    />
                  </Link>
                ) : null}
              </div>
            )}
            <div className={classes.listingpreviewcontainer}>
              <div className={classes.protectiontext}>
                Your request is protected by our escrow service
              </div>
              <div
                className={classes.listingpreviewcontent}
                onClick={goToListing}
              >
                <div className={classes.previewimage}>
                  <img
                    src={listing?.images[0].url ? listing.images[0].url : null}
                    alt={
                      listing?.images[0].filename
                        ? listing.images[0].filename
                        : null
                    }
                  />
                </div>
                <div className={classes.listingpreviewtextcontainer}>
                  <p>331 Phillip St, Waterloo, ON</p>
                  <p>2 Bedroom in 3 Bedroom Suite</p>
                  <p>Jan - April 2023</p>
                </div>
              </div>
            </div>
          </div>
          <div key={requestId} className={classes.container}>
            <Modal
              open={showDeleteModal}
              onClose={handleDeleteCancel}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <h2>Are you sure you want to delete this request?</h2>
                <Button onClick={handleDeleteConfirm}>Yes</Button>
                <Button onClick={handleDeleteCancel}>No</Button>
              </Box>
            </Modal>

            {!data._id !== "" && !listing ? (
              <div>loadingg</div>
            ) : (
              <div className={classes.contentcontainer}>
                <div className={classes.inputcontainer}>
                  {data.status === "pendingSubTenant" ? (
                    <div>Countered subLet Months</div>
                  ) : (
                    <div>subLet Months</div>
                  )}
                  <MonthGrid
                    defaultMoveInDate={defaultMoveInDate}
                    defaultMoveOutDate={defaultMoveOutDate}
                    moveInDate={data.startDate}
                    moveOutDate={data.endDate}
                    shorterStays={
                      listing.shorterStays &&
                      data.status !== "rejected" &&
                      data.status !== "pendingSubTenantUpload" &&
                      data.status !== "pendingTenantUpload"
                    }
                    onDataChange={handleDataChange}
                  />
                </div>

                <div className={classes.inputcontainer}>
                  <div>Viewing Date</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className={classes.datepicker}
                      label={"Select Viewing Date"}
                      value={
                        data.viewingDate && data.viewingDate !== "null"
                          ? dayjs(data.viewingDate)
                          : null
                      }
                      components={{
                        TextField: ({ inputProps, ...props }) => (
                          <TextField
                            {...props}
                            inputProps={{
                              ...inputProps,
                              style: { fontSize: "1rem" },
                            }}
                          />
                        ),
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      onChange={handleOnChangeViewing}
                      shouldDisableDate={shouldDisableDate}
                      disableHighlightToday
                      initialFocusedDate={
                        listing.viewingDates.length > 0
                          ? dayjs(listing.viewingDates[0])
                          : null
                      }
                      disabled={
                        data.status !== "pendingTenant" ||
                        data.status !== "pendingSubTenant"
                      }
                    />
                  </LocalizationProvider>
                </div>

                <div className={classes.inputcontainer}>
                  {data.status === "pendingSubTenant" ? (
                    <div>Countered Price</div>
                  ) : (
                    <div>Price Offer</div>
                  )}
                  <IncrementalInputField
                    data={data}
                    setData={setData}
                    type="price"
                    from="Request"
                    handleOnChange={handleChange}
                    disabled={
                      data.status !== "pendingTenant" ||
                      data.status !== "pendingSubTenant"
                    }
                  />
                </div>
                <div className={classes.requestdetailscontainer}>
                  <div>Your Request</div>
                  <div className={classes.details}>
                    <div className={classes.requestdetailstitle}>
                      subLet months
                    </div>
                    {getMonth(data.startDate)} -{getMonth(data.endDate)}
                  </div>
                  <div className={classes.details}>
                    <div className={classes.requestdetailstitle}>
                      Move in - Move out
                    </div>
                    {new Date(data.startDate)?.toLocaleDateString()} -{" "}
                    {new Date(data.endDate)?.toLocaleDateString()}
                  </div>
                  <div className={classes.details}>
                    <div className={classes.requestdetailstitle}>
                      viewing date
                    </div>
                    {formatDate(data.viewingDate) ?? "No viewing date selected"}
                  </div>
                  <div className={classes.details}>
                    <div className={classes.requestdetailstitle}>
                      price details
                    </div>
                    <div className={classes.detailsrow}>
                      <div>
                        ${data.price} CAD x{" "}
                        {getMonthDiff(data.startDate, data.endDate)} months
                      </div>
                      <div>${subTotal.toString()} CAD</div>
                    </div>
                    <div className={classes.detailsrow}>
                      <div>ATIC</div>
                      <div>${atic.toString()} CAD</div>
                    </div>
                  </div>
                  <div className={classes.details}>
                    <div className={classes.detailsrow}>
                      <div className={classes.requestdetailstitle}>Total</div>
                      <div>${total.toString()} CAD</div>
                    </div>
                  </div>
                  <div className={classes.details}>
                    <div className={classes.detailsrow}>
                      <div className={classes.requestdetailstitle}>
                        Due at Signing
                      </div>
                      <div>${due} CAD</div>
                    </div>
                    <div>First & Last Month Deposit</div>
                    <div>ATIC</div>
                  </div>
                </div>
                <Modal open={showRescindModal} onClose={handleRescindModalCancel}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <h2>Are you sure you want to rescind?</h2>
                    <Button onClick={handleRescindModalConfirm}>Yes</Button>
                    <Button onClick={handleRescindModalCancel}>No</Button>
                  </Box>
                </Modal>
                <Modal open={showRejectModal} onClose={handleRejectModalCancel}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <h2>Are you sure you want to reject?</h2>
                    <Button onClick={handleRejectModalConfirm}>Yes</Button>
                    <Button onClick={handleRejectModalCancel}>No</Button>
                  </Box>
                </Modal>
              </div>
            )}
            <CSSTransition
              in={openAcceptModal}
              timeout={300}
              classNames={{
                enter: classes["slide-up-enter"],
                enterActive: classes["slide-up-enter-active"],
                exit: classes["slide-up-exit"],
                exitActive: classes["slide-up-exit-active"],
              }}
              unmountOnExit
            >
              <AcceptModalWithSpinner
                isLoading={loading}
                openModal={openAcceptModal}
                setOpenModal={setOpenAcceptModal}
                selectedAgreement={selectedAgreement}
                selectedGovId={selectedGovId}
                setSelectedAgreement={setSelectedAgreement}
                setSelectedGovId={setSelectedGovId}
                handleFileUploadAgreement={handleFileUploadAgreement}
                handleFileUploadGovId={handleFileUploadGovId}
                handleFileDownload={handleFileDownload}
                handleFileDelete={handleFileDelete}
                handleAcceptConfirm={handleAcceptConfirm}
                handleFinalAccept={handleFinalAccept}
                request={data}
                getMonth={getMonth}
                formatDate={formatDate}
                getMonthDiff={getMonthDiff}
                subTotal={subTotal}
                atic={atic}
                total={total}
                due={due}
                canAccept={canAccept}
                uploadProgressAgreement={uploadProgressAgreement}
                uploadProgressGovId={uploadProgressGovId}
              />
            </CSSTransition>
          </div>
          <BottomBlock
            listing={listing}
            handleRequest={handleRequest}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleUpdate={handleUpdate}
            handleCounter={handleCounter}
            handleRescind={handleRescind}
            data={data}
            originalPrice={originalPrice}
            originalMoveInDate={originalMoveInDate}
            originalMoveOutDate={originalMoveOutDate}
            originalViewingDate={originalViewingDate}
            status={data.status}
            status_reason={data.status_reason}
            reason={data.status_reason}
            goToNewRequest={goToNewRequest}
            fetchRecentRequest={fetchRecentRequest}
            mostRecentRequest={mostRecentRequest}
            goToRecentRequest={goToRecentRequest}
            isInTransaction={subtenantIsInTransaction}
            listingIsInTransaction={listingIsInTransaction}
          />
        </>
      )}
    </>
  );
}

export default Request;
