import React from 'react'
import { Link } from 'react-router-dom'

import classes from './BottomNav.module.css'

function BottomNav() {
  return (
    <div className={classes.wrapper}>
      <footer className={classes.container}>
      <nav>
        <Link to='/'>Explo</Link>
      </nav>
      <nav>
        <Link to='/signup'>Profile</Link>
      </nav>
      </footer>
    </div>
  )
}

export default BottomNav