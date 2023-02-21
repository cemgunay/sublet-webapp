import React from 'react'
import { NavLink } from 'react-router-dom'

import classes from './BottomNav.module.css'

function BottomNav() {
  return (
    <div className={classes.wrapper}>
      <nav className={classes.container}>
        <NavLink to='/' className={({ isActive }) =>
              isActive ? classes.active : undefined
            }>
          <i class="fa-solid fa-magnifying-glass"></i>
          Explore
        </NavLink>
        <NavLink to='/signup' className={({ isActive }) =>
              isActive ? classes.active : undefined
            }>
          <i class="fa-solid fa-user"></i>
          Profile
        </NavLink>
      </nav>
    </div>
  )
}

export default BottomNav