import React, { useState, useEffect, useContext, useRef } from "react";
import classes from "./SubTenantInbox.module.css";
import Conversation from "../../components/Conversations/Conversation";
import Message from "../../components/Message/Message";

import api from "../../api/axios";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

function SubTenantInbox() {
  const { user: currentUser } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await api.get("/conversations/" + currentUser._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser._id]);

  console.log(conversations);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await api.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
  console.log(messages);

  // Send a message, use this to start a new conversation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentChat._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentChat._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await api.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className={classes.messenger}>
        <div className={classes.chatMenu}>
          <div className={classes.chatMenuWrapper}>
            Menu
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>
        <div className={classes.chatBox}>
          <div className={classes.chatBoxWrapper}>
            <div className={classes.chatBoxTop}>
              {currentChat ? (
                <>
                  <div className={classes.chatBarTop}>
                    {messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.sender === currentUser._id}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={classes.chatBarTop}>
                    <textarea
                      className={classes.chatMessageInput}
                      placeholder="write something..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className={classes.chatSubmitButton} onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <span className={classes.noConversationText}>
                  Open a conversation to start a chat.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubTenantInbox;
