// ConversationsList.js
import React, { useState, useEffect, useContext } from "react";
import Conversation from "../../components/Conversations/Conversation";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import classes from "./SubTenantInbox.module.css";
import BottomNav from "../../components/BottomNav/BottomNav";

function SubTenantInbox() {
  const { user: currentUser, role } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentTab, setCurrentTab] = useState("active");
  const [archivedConversations, setArchivedConversations] = useState([]);

  //to get conversations
  const getConversations = async () => {
    try {
      const res = await api.get(
        "/conversations/user/active/" + currentUser._id + "/" + role
      );
      setConversations(res.data);

      const archivedRes = await api.get(
        "/conversations/user/archived/" + currentUser._id + "/" + role
      );
      setArchivedConversations(archivedRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConversations();
  }, [currentUser._id, role]);

  //to render correct conversations
  const renderConversations = () => {
    if (currentTab === "active") {
      return conversations.map((c) => (
        <Conversation
          key={c._id}
          conversation={c}
          currentUser={currentUser}
          role={role}
          refreshConversations={getConversations}
        />
      ));
    }

    if (currentTab === "archived") {
      return archivedConversations.map((c) => (
        <Conversation
          key={c._id}
          conversation={c}
          currentUser={currentUser}
          role={role}
          refreshConversations={getConversations}
        />
      ));
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Inbox</h1>
        <div className={classes.buttoncontainer}>
          <button
            className={`${classes.button} ${
              currentTab === "active" ? classes.active : classes.inactive
            }`}
            onClick={() => setCurrentTab("active")}
          >
            Inbox
          </button>
          <button
            className={`${classes.button} ${
              currentTab === "archived" ? classes.active : classes.inactive
            }`}
            onClick={() => setCurrentTab("archived")}
          >
            Archived
          </button>
        </div>
      </div>
      {conversations ? (
        <div className={classes.conversationcontainer}>
          {renderConversations()}
        </div>
      ) : (
        <div>Loading</div>
      )}
      <footer className={classes.footer}>
        <BottomNav />
      </footer>
    </div>
  );
}

export default SubTenantInbox;
