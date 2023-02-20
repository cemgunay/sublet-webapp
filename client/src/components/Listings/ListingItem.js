import React from 'react'
import Card from '../UI/Card'

import classes from './ListingItem.module.css'

function ListingItem(props) {
  return (
    <li className={classes.item}>
        <Card>
            <div className={classes.image}>
                <img src={props.image} alt={props.title}/>
            </div>
            <div className={classes.content}>
                <h3>{props.title}</h3>
                <address>{props.address}</address>
                <p>{props.description}</p>
            </div>
        </Card>
    </li>
  )
}

export default ListingItem