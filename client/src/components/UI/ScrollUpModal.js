import React from "react";
import { CSSTransition } from "react-transition-group";

import classes from "./ScrollUpModal.module.css";

function ScrollUpModal({ children, variable }) {
  return (
    <CSSTransition
      in={variable}
      timeout={300}
      classNames={{
        enter: classes["slide-up-enter"],
        enterActive: classes["slide-up-enter-active"],
        exit: classes["slide-up-exit"],
        exitActive: classes["slide-up-exit-active"],
      }}
      unmountOnExit
    >
      <div className={classes.container}>{children}</div>
    </CSSTransition>
  );
}

export default ScrollUpModal;
