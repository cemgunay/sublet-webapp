import React, { useState } from 'react'
import Collage from '../Collage/Collage'
import classes from './Modal.module.css'

function Modal({ closeModal, images }) {

    const handleClick = () => {
        closeModal(false)
    }

  return (
    <>
    <button onClick={handleClick}>Close</button>
    <div>This is where the muhfuckin collage will go STYLL</div>
    <Collage images={images}/>

    </>
  )
}

export default Modal