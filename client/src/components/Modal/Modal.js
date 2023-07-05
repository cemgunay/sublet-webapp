import React, { useState } from "react";
import Collage3 from "../Collage/Collage3";
import classes from "./Modal.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'



function Modal({ closeModal, images }) {
  const handleClick = () => {
    closeModal(false);
  };

  return (
    <div className={classes.modal}>
      <div className={classes.back}>
      <FontAwesomeIcon className={classes.back} icon={faChevronLeft} onClick={handleClick}/>
      </div>
      <Collage3 images={images} />
    </div>
  );
}

export default Modal;
