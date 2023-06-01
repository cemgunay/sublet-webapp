import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";

import { CSSTransition } from "react-transition-group";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import MonthGrid from "../../components/Util/MonthGrid";

import classes from "./RequestDetails.module.css";
import BottomBlock from "../../components/UI/BottomBlock";
import DeclineModal from "../../components/Sublets/DeclineModal";
import useRequestFormContext from "../../hooks/useRequestFormContext";

import { toast } from "react-toastify";
import AcceptModal from "../../components/Sublets/AcceptModal";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faMessage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

function RequestDetails() {
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  const { listingId, requestId } = useParams();
  const location = useLocation();
  const { state } = location;

  const [listing, setListing] = useState(null);
  const [request, setRequest] = useState([]);

  //to set the initial dates for MonthGrid
  const [defaultMoveInDate, setDefaultMoveInDate] = useState(null);
  const [defaultMoveOutDate, setDefaultMoveOutDate] = useState(null);

  //for modals
  const [openDeclineModal, setOpenDeclineModal] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);

  //for file upload
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [selectedGovId, setSelectedGovId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  //for disabling accept button
  const [canAccept, setCanAccept] = useState(false);

  //current user
  const { user: currentUser, role, dispatch } = useAuth();

  const navigate = useNavigate();

  //from context
  const { data, setData, handleChange } = useRequestFormContext();

  //subtenant details
  const [subtenant, setSubtenant] = useState(null);

  //conversation
  const [conversation, setConversation] = useState(null);

  //delete dialog for deleting reqeust
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  //to check if tenant is in transaction or if subtenant is in transaction
  const [isInTransaction, setIsInTransaction] = useState(false);
  const getSubTenant = async (subTenantId) => {
    try {
      const response = await api.get("/users/id/" + subTenantId);
      const subTenant = response.data;
      setSubtenant(subTenant);
      return subTenant;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSubTenant = async () => {
      const subTenant = await getSubTenant(data.subTenantId);

      console.log(currentUser);
      console.log(subTenant);

      if (
        currentUser?.currentTenantTransaction ||
        subTenant?.currentSubTenantTransaction
      ) {
        setIsInTransaction(true);
      }
    };

    fetchSubTenant();
  }, [data.subTenantId]);

  //to go back
  const goBack = () => {
    navigate(-1);
  };

  //go to listing when clicked
  const goToListing = (e) => {
    e.preventDefault();

    navigate("/listing/" + listingId);
  };

  //if there is no state, take listing from parameters and DB
  useEffect(() => {
    if (!state || !state.listing) {
      api.get("/listings/" + listingId).then((response) => {
        setListing(response.data);
      });
    } else {
      setListing(state.listing);
    }
  }, [listingId, state]);

  //if there is no state(FUCK STATE), take requests from parameters and DB
  useEffect(() => {
    api.get("/requests/" + requestId).then((response) => {
      setRequest(response.data);
      setDefaultMoveInDate(response.data.startDate);
      setDefaultMoveOutDate(response.data.endDate);
    });
  }, [requestId]);

  //when request updates also update data
  useEffect(() => {
    setData(request);
  }, [request, setData]);

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

  // Function to round a number up to the nearest quarter (0.25, 0.5, 0.75)
  const roundToQuarter = (num) => {
    return Math.ceil(num * 4) / 4;
  };

  //to get the difference between in months between two ISO
  const getMonthDiff = (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const diffInMs = Math.abs(date2 - date1); // absolute difference in milliseconds
    const avgMsInMonth = 1000 * 60 * 60 * 24 * 32; // average milliseconds in a month
    const diffInMonths = diffInMs / avgMsInMonth; // difference in months
    return roundToQuarter(diffInMonths); // round to nearest quarter
  };

  //for the totals to be displayed
  const subTotal = parseFloat(
    (request.price * getMonthDiff(request.startDate, request.endDate)).toFixed(
      2
    )
  );

  const atic = parseFloat((request.price * 2 * 0.04).toFixed(2));

  const total = (subTotal + atic).toFixed(2);
  const due = request.price * 2 + atic;

  console.log(request);

  //to open the accept modal
  const handleAccept = () => {
    setOpenAcceptModal(!openAcceptModal);
  };

  //to go through with the accept once the accept button is available to click (given that the docs are uploaded)
  const handleAcceptConfirm = async () => {
    try {
      const response = await api.put(
        "/requests/acceptAsTenant/" + requestId,
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

      navigate("/host/active");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleFinalAccept = async () => {
    api
      .post(
        "/requests/confirm/" + request._id,
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
              currentUser.currentTenantTransaction !==
              response.data.currentTenantTransaction
            ) {
              navigate("/host/confirmed");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDecline = () => {
    setOpenDeclineModal(true);
  };

  const handleRequest = () => {};

  const handleUpdate = () => {};

  //says rescind but this actually handles rejection of your own counter
  const handleReject = () => {
    const updateRequest = {
      subTenantId: data.subTenantId,
      status: "rejected",
      status_reason: "Offer has been rejected.",
    };

    api
      .put("/requests/update/" + data._id, updateRequest)
      .then((response) => {
        console.log(response.data);
        setData((prevData) => ({
          ...prevData,
          status: "rejected",
          status_reason: "Offer has been rejected",
        }));
        toast.success("The offer has been rejected");
        navigate("/host/listing/" + data.listingId);
      })
      .catch((error) => {
        toast.error(
          "Error, can't reject counter offer, please try again later"
        );
        console.error(error);
      });
  };

  //for file agreement upload
  const handleFileUploadAgreement = () => {
    const formData = new FormData();

    const documentType = "Sublet Agreement";

    formData.append("file", selectedAgreement);
    formData.append("user", JSON.stringify(currentUser));
    formData.append("requestId", request._id);
    formData.append("documentType", documentType);
    formData.append("role", role);

    api
      .post("/uploads/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((response) => {
        console.log(response);
        // Fetch the updated request details after successful upload
        api.get("/requests/" + requestId).then((response) => {
          setRequest(response.data);
        });
        setUploadProgress(0);
        setSelectedAgreement(null);
      })
      .catch((error) => {
        console.log(error);
        setUploadProgress(0);
        setSelectedAgreement(null);
      });
  };

  //for file govid upload
  const handleFileUploadGovId = () => {
    const formData = new FormData();

    const documentType = "Government ID";

    console.log(currentUser);

    formData.append("file", selectedGovId);
    formData.append("user", JSON.stringify(currentUser));
    formData.append("requestId", request._id);
    formData.append("documentType", documentType);
    formData.append("role", role);

    api
      .post("/uploads/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((response) => {
        console.log(response);

        // Fetch the updated request details after successful upload
        api.get("/requests/" + requestId).then((response) => {
          console.log(response.data);
          setRequest(response.data);
        });
        setUploadProgress(0);
        setSelectedGovId(null);
      })
      .catch((error) => {
        console.log(error);
        setUploadProgress(0);
        setSelectedGovId(null);
      });
  };

  //for file download
  const handleFileDownload = (fileName) => {
    console.log(request);

    // Find the Sublet Agreement document in the tenant's documents
    const document = request.tenantDocuments.find(
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

      // Update the request state with the data from the response
      setRequest(response.data);
    } catch (error) {
      console.error(error);
      toast.error("There was an error deleting the file, try again");
    }
  };

  //to open and close the dialog
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  //This is for deleting past requests
  const handleDeleteConfirm = () => {
    // call your delete API here

    const updateRequest = {
      showTenant: false,
      tenantId: currentUser._id
    };

    api
      .put("/requests/update/" + requestId, updateRequest)
      .then((response) => {
        console.log(response.data);
        setRequest(response.data);
        toast.success("Past request deleted successfully");
        navigate(`/host/listing/${listingId}`);
      })
      .catch((error) => {
        toast.error("Failed to delete past request: " + error.message);
        console.error(error);
      });

    closeDeleteDialog();
  };

  //to set accept button to disabled or not
  //to set accept button to disabled or not
  useEffect(() => {
    if (
      request.status === "pendingFinalAccept" ||
      request.tenantDocuments?.length == 2
    ) {
      if (request.tenantFinalAccept) {
        setCanAccept(false);
      } else {
        console.log("hello");
        setCanAccept(true);
      }
    } else {
      setCanAccept(false);
    }
  }, [request.status, request.tenantDocuments, request.tenantFinalAccept]);

  return (
    <div>
      {!request._id !== "" && listing && !data._id && !subtenant ? (
        <div>loading</div>
      ) : (
        <>
          <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
            <DialogTitle>
              Are you sure you want to delete this request?
            </DialogTitle>
            <DialogActions>
              <Button onClick={closeDeleteDialog}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <div className={classes.headercontainer}>
            {request.status === "rejected" ? (
              <div className={classes.header}>
                <div className={classes.back} onClick={goBack}>
                  <FontAwesomeIcon icon={faCircleChevronLeft} />
                </div>
                <div>{subtenant?.firstName}'s Request</div>
                <div className={classes.deleteiconcontainer}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    onClick={openDeleteDialog}
                  />
                </div>
              </div>
            ) : (
              <div className={classes.header}>
                <div className={classes.back} onClick={goBack}>
                  <FontAwesomeIcon icon={faCircleChevronLeft} />
                </div>
                <div>{subtenant?.firstName}'s Request</div>
                <Link
                  to={`/host/inbox/${conversation?._id}`}
                  style={{ color: "inherit" }}
                  className={classes.chat}
                >
                  <FontAwesomeIcon
                    icon={faMessage}
                    className={classes.chaticon}
                  />
                </Link>
              </div>
            )}
            <div className={classes.listingpreviewcontainer}>
              <div className={classes.protectiontext}>
                The request is protected by our escrow service
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
          <div className={classes.contentcontainer}>
            <div>
              <div className={classes.inputcontainer}>
                <div>subLet Months</div>
                <MonthGrid
                  defaultMoveInDate={request.startDate}
                  defaultMoveOutDate={request.endDate}
                  moveInDate={request.startDate}
                  moveOutDate={request.endDate}
                  shorterStays={false}
                />
              </div>
              <div className={classes.requestdetailscontainer}>
                <div>{subtenant?.firstName}'s Request Details</div>
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
              <CSSTransition
                in={openDeclineModal}
                timeout={300}
                classNames={{
                  enter: classes["slide-up-enter"],
                  enterActive: classes["slide-up-enter-active"],
                  exit: classes["slide-up-exit"],
                  exitActive: classes["slide-up-exit-active"],
                }}
                unmountOnExit
              >
                <DeclineModal
                  openModal={openDeclineModal}
                  setOpenModal={setOpenDeclineModal}
                  request={request}
                  data={data}
                  setData={setData}
                  handleChange={handleChange}
                  defaultMoveInDate={defaultMoveInDate}
                  defaultMoveOutDate={defaultMoveOutDate}
                  currentUser={currentUser}
                />
              </CSSTransition>
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
                <AcceptModal
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
                  handleFinalAccept={handleFinalAccept}
                  handleAcceptConfirm={handleAcceptConfirm}
                  request={request}
                  getMonth={getMonth}
                  formatDate={formatDate}
                  getMonthDiff={getMonthDiff}
                  subTotal={subTotal}
                  atic={atic}
                  total={total}
                  due={due}
                  canAccept={canAccept}
                  uploadProgress={uploadProgress}
                />
              </CSSTransition>
            </div>
          </div>
          <BottomBlock
            handleRequest={handleRequest}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
            handleUpdate={handleUpdate}
            handleReject={handleReject}
            data={data}
            from={"RequestDetails"}
            originalPrice={request.price}
            originalMoveInDate={request.startDate}
            originalMoveOutDate={request.endDate}
            status={data.status}
            status_reason={data.status_reason}
            isInTransaction={isInTransaction}
          />
        </>
      )}
    </div>
  );
}

export default RequestDetails;
