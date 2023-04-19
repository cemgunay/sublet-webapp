import React from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../Carousel/Carousel'

import classes from './ListingItem.module.css'

function ListingItem({listing}) {

  console.log(listing)

  const images = listing.images.map(({ url }) => url);

  const formattedAddress =
      listing.location.address1 +
      ", " +
      listing.location.city +
      ", " +
      listing.location.stateprovince;

  return (
    <Link to={'/listing/'+listing._id} state={{listing:listing}} className={classes.container}>
        <div className={classes.imageContainer}>
          <Carousel dots={true} images={images} index={0} from={'Explore'}/>
        </div>
        <div className={classes.content}>
          <div className={classes.first}>
            <h3>{listing.title}</h3>
            <p>{listing.days_left}</p>
          </div>
          <address>{formattedAddress}</address>
          <p>{listing.dates}</p>
          <div className={classes.second}>
            <h3 className={classes.price}>{listing.price}</h3>
            <p>{listing.views}</p>
          </div>
        </div>
    </Link>
  )
}

export default ListingItem