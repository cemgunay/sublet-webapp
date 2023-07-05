import classes from "./Conversation.module.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import React from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Conversation({
  conversation,
  currentUser,
  role,
  refreshConversations,
  from
}) {
  const [listing, setListing] = useState(null);
  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [lastMessage, setLastMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  //to get user
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    //to get user
    const getUser = async () => {
      try {
        const res = await api.get("/users/id/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    //to get request and listing
    const getRequestAndListing = async (requestId) => {
      try {
        const resRequest = await api.get("/requests/" + requestId);
        setRequest(resRequest.data);
        try {
          const resListing = await api.get(
            "/listings/" + resRequest.data.listingId
          );
          setListing(resListing.data);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
    getRequestAndListing(conversation.request._id);
  }, [currentUser, conversation]);

  // to get the last message
  useEffect(() => {
    const getLastMessage = async () => {
      try {
        const res = await api.get(
          "/conversations/lastMessage/" + conversation._id
        );
        setLastMessage(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getLastMessage();
  }, [conversation]);

  //to open and close the dialog
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteConversation = async () => {
    try {
      const res = await api.patch(
        "/conversations/soft-delete/" + conversation._id,
        role,
        {
          headers: {
            //Send user ID in headers
            "x-user-id": currentUser._id,
          },
        }
      );
      console.log(res.data);
      toast.success("Conversation has been successfully deleted");
      refreshConversations(); // refresh conversations after delete
    } catch (err) {
      console.log(err);
      toast.error("Conversation could not be deleted, try again later");
    }

    console.log("Delete conversation", conversation._id);
    closeDeleteDialog();
  };

  return (
    <>
      {user && request && listing ? (
        <div className={classes.container}>
          <Link
            to={`${conversation._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
            className={classes.conversationcontainer}
          >
            <img
              className={classes.conversationImg}
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : "/images/logo192.png" //add default image here if no profile image
              }
              alt="profilepic"
            />
            {lastMessage ? (
              <div className={classes.conversationcontent}>
                <div className={classes.conversationtitle}>
                  <div className={classes.conversationtitleheader}>
                    <div className={classes.conversationname}>
                      {user.firstName}
                    </div>
                    <div className={classes.conversationprice}>
                      ${request.price}
                    </div>
                  </div>

                  <div className={classes.conversationdate}>
                    {lastMessage.message
                      ? format(request.createdAt)
                      : format(lastMessage.createdAt)}
                  </div>
                </div>
                <div className={classes.conversationlisting}>
                  {listing.title}
                </div>
                <div className={classes.conversationmessage}>
                  {lastMessage.text?.length > 28 ? (
                    <span title={lastMessage.text}>{`${lastMessage.text.slice(
                      0,
                      28
                    )}...`}</span>
                  ) : (
                    lastMessage.text
                  )}
                </div>
              </div>
            ) : null}
          </Link>
          <button onClick={openDeleteDialog} className={classes.button}>
            <FontAwesomeIcon icon={faTrash} className={classes.icon} />
          </button>
          <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
            <DialogTitle>
              Are you sure you want to delete this conversation?
            </DialogTitle>
            <DialogActions>
              <Button onClick={closeDeleteDialog}>Cancel</Button>
              <Button onClick={deleteConversation} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : null}
    </>
  );
}

export default Conversation;
