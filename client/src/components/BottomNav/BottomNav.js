import React from 'react'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons'

import classes from './BottomNav.module.css'

function BottomNav() {
  return (
    <div className={classes.wrapper}>
      <nav className={classes.container}>
        <NavLink to='/' className={({ isActive }) =>
              isActive ? classes.active : undefined
            }>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          Explore
        </NavLink>
        <NavLink to='/signup' className={({ isActive }) =>
              isActive ? classes.active : undefined
            }>
          <FontAwesomeIcon icon={faUser} />
          Profile
        </NavLink>
      </nav>
    </div>
  )
}

export default BottomNav