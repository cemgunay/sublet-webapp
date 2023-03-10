import React from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../Carousel/Carousel'

import classes from './ListingItem.module.css'

function ListingItem(props) {

  return (
    <Link to={'/listing/'+props.id} state={{listing:props}} className={classes.container}>
        <div className={classes.imageContainer}>
          <Carousel dots={true} images={props.image} index={0} from={'Explore'}/>
        </div>
        <div className={classes.content}>
          <div className={classes.first}>
            <h3>{props.title}</h3>
            <p>{props.days_left}</p>
          </div>
          <address>{props.address}</address>
          <p>{props.dates}</p>
          <div className={classes.second}>
            <h3 className={classes.price}>{props.price}</h3>
            <p>{props.views}</p>
          </div>
        </div>
    </Link>
  )
}

export default ListingItem