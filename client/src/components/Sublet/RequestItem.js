import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Modal, Box, Button } from "@mui/material";

import classes from "./RequestItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function RequestItem({ listing, request, name, price, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedDate;
  };

  //all 3 below to handle delete modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(request._id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={classes.container}>
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
      <Link
        to={"request/" + request._id}
        state={{ listing, request }}
        className={classes.requestItem}
      >
        <div>
          {name} - {formatDate(request.updatedAt)}
        </div>

        <div
          className={
            request.status === "confirmed" ||
            request.status === "pendingSubTenantUpload" ||
            request.status === "pendingTenantUpload" ||
            request.status === "pendingFinalAccept"
              ? classes.winningprice
              : request.status === "rejected"
              ? classes.rejectedprice
              : classes.losingprice
          }
        >
          <div>
            {request.status === "pendingSubTenant"
              ? "Countered: "
              : request.status === "rejected"
              ? "Rejected: "
              : request.status === "confirmed"
              ? "Accepted: "
              : request.status === "pendingSubTenantUpload"
              ? "Pending subtenant upload: "
              : request.status === "pendingTenantUpload"
              ? "Pending your upload: "
              : request.status === "pendingFinalAccept"
              ? "Waiting to sign: "
              : "Pending: "}
          </div>
          <div>${price}</div>
        </div>
      </Link>
      {request.status === "rejected" ? (
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
      ) : null}
    </div>
  );
}

export default RequestItem;
