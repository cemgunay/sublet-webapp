// Chat.js
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Message from "../../components/Message/Message";
import api from "../../api/axios";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

import classes from "./SubTenantInboxChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import TextareaAutosize from "react-textarea-autosize";

function SubTenantInboxChat() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [chatPartnerName, setChatPartnerName] = useState(null);
  const [request, setRequest] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const spacerRef = useRef(null);
  const navigate = useNavigate();

  // Set the initial height of the spacer on component mount
  useEffect(() => {
    if (spacerRef.current) {
      spacerRef.current.style.height = "5px";
    }
  }, []);

  // to get the conversation
  useEffect(() => {
    const getChat = async () => {
      try {
        const res = await api.get("/conversations/" + id);
        setCurrentChat(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getChat();
  }, [id]);

  useEffect(() => {
    socket.current = io("ws://localhost:8080");
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
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {});
  }, [currentUser]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await api.get("/messages/" + id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [id]);

  //to get user
  useEffect(() => {
    const friendId = currentChat?.members.find((m) => m !== currentUser._id);

    //to get user
    const getUser = async () => {
      try {
        const res = await api.get("/users/id/" + friendId);
        setChatPartnerName(res.data.firstName);
      } catch (err) {
        console.log(err);
      }
    };

    //to get request
    const getRequest = async (requestId) => {
      try {
        const res = await api.get("/requests/" + requestId);
        setRequest(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (currentChat) {
      getUser();
      getRequest(currentChat.request);
    }
  }, [currentUser, currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await api.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
      spacerRef.current.style.height = "0px";
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100); // adjust delay as needed
  }, [messages]);

  const handleBack = () => {
    navigate(-1);
  };

  console.log(currentChat);

  return (
    <div className={classes.container}>
      {chatPartnerName && currentChat && request ? (
        <>
          <div className={classes.header}>
            <button onClick={handleBack} className={classes.button}>
              <FontAwesomeIcon icon={faArrowLeft} className={classes.icon} />
            </button>
            <h1>{chatPartnerName}</h1>
            <Link
              to={`/listing/${request.listingId}/request/${request._id}?startDate=${request.startDate}&endDate=${request.endDate}&viewingDate=${request.viewingDate}&price=${request.price}`}
              style={{color: "inherit" }}
            >
              <h3>${request.price}</h3>
            </Link>
          </div>

          <div className={classes.body}>
            <div className={classes.allmessagescontainer}>
              {messages.map((m, index) => (
                <div
                  className={classes.messageContainer}
                  ref={index === messages.length - 1 ? scrollRef : null}
                  key={m._id}
                >
                  <Message message={m} own={m.sender === currentUser._id} />
                </div>
              ))}
            </div>
          </div>

          <div className={classes.footerwrapper}>
            <div className={classes.spacer} ref={spacerRef}></div>
            <div className={classes.footer}>
              <div className={classes.inputContainer}>
                <TextareaAutosize
                  className={classes.textArea}
                  placeholder="write something..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  minRows={1}
                  onHeightChange={(height) => {
                    spacerRef.current.style.height = height + "px";
                    window.scrollTo(0, document.body.scrollHeight);
                  }}
                />
                {newMessage && (
                  <button onClick={handleSubmit} className={classes.button}>
                    <FontAwesomeIcon
                      className={classes.icon}
                      icon={faArrowUp}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SubTenantInboxChat;
