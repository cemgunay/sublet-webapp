import classes from "./Conversation.module.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import React from "react";

function Conversation({ conversation, currentUser }) {

  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await api.get("/users/id/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <>
      <div className={classes.conversation}>Conversation</div>
      <img className={classes.conversationImg} src={
          user?.profilePicture
            ? PF + user.profilePicture
            : PF + "logo192.png" //add default image here if no profile image
        } />
      <span className={classes.conversationName}>{user?.email}</span>
    </>
  );
}

export default Conversation;
