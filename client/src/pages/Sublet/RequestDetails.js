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
import DeclineModalWithSpinner from "../../components/Sublets/DeclineModal";
import useRequestFormContext from "../../hooks/useRequestFormContext";

import { toast } from "react-toastify";
import AcceptModalWithSpinner from "../../components/Sublets/AcceptModal";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faMessage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Dialog, DialogActions, DialogTitle, Modal } from "@mui/material";
import { ClipLoader } from "react-spinners";

function RequestDetails() {
  //useParams and useLocation are to pass the listing prop from listingItem through to this component
  const { listingId, requestId } = useParams();
  const location = useLocation();
  const { state } = location;

  const [loading, setLoading] = useState(false);

  const [listing, setListing] = useState(null);
  const [request, setRequest] = useState([]);

  //to set the initial dates for MonthGrid
  const [defaultMoveInDate, setDefaultMoveInDate] = useState(null);
  const [defaultMoveOutDate, setDefaultMoveOutDate] = useState(null);

  //for modals
  const [openDeclineModal, setOpenDeclineModal] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);

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

  //fetch subtenant
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

  //get specific chat
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

  //to open the accept modal
  const handleAccept = () => {
    setOpenAcceptModal(!openAcceptModal);
  };

  //to go through with the accept once the accept button is available to click (given that the docs are uploaded)
  const handleAcceptConfirm = async () => {
    setLoading(true);

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
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error(error);
      setLoading(false);
      throw error;
    }
  };

  const handleFinalAccept = async () => {
    setLoading(true);
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

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  //open decline modal
  const handleDecline = () => {
    setOpenDeclineModal(true);
  };

  //idk what these two are for tbh
  const handleRequest = () => {};
  const handleUpdate = () => {};

  //opens reject modal
  const handleReject = (e) => {
    e.preventDefault();
    setShowRejectModal(true);
  };

  //Reject after countering
  const handleRejectModalConfirm = () => {
    setLoading(true);

    const updateRequest = {
      subTenantId: data.subTenantId,
      status: "rejected",
      status_reason: "Offer has been rejected",
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
        setLoading(false);
      })
      .catch((error) => {
        toast.error(
          "Error, can't reject counter offer, please try again later"
        );
        console.error(error);
        setLoading(false);
      });
  };

  // Just close the reject modal
  const handleRejectModalCancel = () => {
    setShowRejectModal(false);
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
          setUploadProgressAgreement(percentCompleted);
        },
      })
      .then((response) => {
        console.log(response);
        // Fetch the updated request details after successful upload
        api.get("/requests/" + requestId).then((response) => {
          setRequest(response.data);
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
          setUploadProgressGovId(percentCompleted);
        },
      })
      .then((response) => {
        console.log(response);

        // Fetch the updated request details after successful upload
        api.get("/requests/" + requestId).then((response) => {
          console.log(response.data);
          setRequest(response.data);
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

    setLoading(true);

    const updateRequest = {
      showTenant: false,
      tenantId: currentUser._id,
    };

    api
      .put("/requests/update/" + requestId, updateRequest)
      .then((response) => {
        console.log(response.data);
        setRequest(response.data);
        toast.success("Past request deleted successfully");
        navigate(`/host/listing/${listingId}`);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to delete past request: " + error.message);
        console.error(error);
        setLoading(false);
      });

    closeDeleteDialog();
  };

  //to set accept button to disabled or not in the accept modal not in the bottom block of request details
  useEffect(() => {
    // Helper function to check if tenant has uploaded both required documents
    const tenantHasUploadedAllDocs = () =>
      request.tenantDocuments.some((obj) => obj.type === "Sublet Agreement") &&
      request.tenantDocuments.some((obj) => obj.type === "Government ID");

    // Helper function to check if subtenant has uploaded at least one document
    const subtenantHasUploaded = () =>
      request.subtenantDocuments && request.subtenantDocuments.length >= 1;

    console.log("YEEEEEEEET");

    console.log(request.status);

    switch (request.status) {
      case "pendingTenant":
        if (tenantHasUploadedAllDocs()) {
          console.log("Tenant has uploaded all documents and can accept.");
          setCanAccept(true);
        } else {
          console.log("Tenant must upload all documents before accepting.");
          setCanAccept(false);
        }
        break;

      case "pendingSubTenant":
        // Awaiting response from the subtenant
        setCanAccept(false);
        break;

      case "pendingTenantUpload":
        if (tenantHasUploadedAllDocs()) {
          console.log("Tenant can accept.");
          setCanAccept(true);
        } else {
          console.log("Tenant must upload all documents.");
          setCanAccept(false);
        }
        break;

      case "pendingSubTenantUpload":
        if (subtenantHasUploaded()) {
          console.log("Subtenant can accept.");
          setCanAccept(true);
        } else {
          console.log("Waiting for subtenant to upload.");
          setCanAccept(false);
        }
        break;

      case "pendingFinalAccept":
        if (tenantHasUploadedAllDocs() && subtenantHasUploaded()) {
          console.log("Ready for final accept.");
          setCanAccept(true);
        } else {
          console.log("Waiting for all documents.");
          setCanAccept(false);
        }
        break;

      case "confirmed":
      case "rejected":
      default:
        // Request has been confirmed, rejected, or any other unknown status
        setCanAccept(false);
        break;
    }
  }, [
    request.status,
    request.tenantDocuments,
    request.tenantFinalAccept,
    request.subtenantDocuments,
  ]);

  return (
    <div>
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
                <DeclineModalWithSpinner
                  setLoading={setLoading}
                  isLoading={loading}
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
                  uploadProgressAgreement={uploadProgressAgreement}
                  uploadProgressGovId={uploadProgressGovId}
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
