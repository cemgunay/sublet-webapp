import classes from "./Message.module.css";
import './Message.module.css'
import React from 'react'
import { format } from "timeago.js";


function Message({message, own}) {
  return (
    <div className={own ? classes.messageOwn : classes.message}>
        <div className={classes.messageTop}>
          <img className={classes.messageImage}
          src=""
          alt=""
          />
          <p className={own ? classes.messageOwnMessageText : classes.messageText}>{message.text}</p>       
        </div>
        <div className={classes.messageBottom}> {format(message.createdAt)} </div>
    </div>
  )
}

export default Message;