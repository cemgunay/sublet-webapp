import classes from "./Message.module.css";
import './Message.module.css'
import React from 'react'
import { format } from "timeago.js";


function Message({message, own}) {
  return (
    <div className={own ? classes.messageOwn : classes.message}>
        <div className={classes.messageTop}>
          <div className={own ? classes.messageOwnMessageText : classes.messageText}>{message.text}</div>       
        </div>
        <div className={classes.messageBottom}> {format(message.createdAt)} </div>
    </div>
  )
}

export default Message;