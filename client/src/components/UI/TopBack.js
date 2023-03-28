import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import classes from './TopBack.module.css'

function TopBack(props) {

  const navigate = useNavigate()

  const handleOnClick = () => {
    navigate(props.path)
  }

  return (
    <div className={classes.back}>
      <FontAwesomeIcon className={classes.back} icon={props.icon === 'xmark' ? faXmark : null} size="lg" onClick={handleOnClick}/>
    </div>
  )
}

export default TopBack