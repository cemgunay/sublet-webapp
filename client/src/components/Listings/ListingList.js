import React from 'react'
import ListingItem from './ListingItem'

import classes from './ListingList.module.css'

function ListingList(props) {

  console.log(props.listings)

  //const images = props.data.images.map(({ url }) => url);

  return (
    <div className={classes.container}>
      {props.listings.length && props.listings
      .map(listing => (
        <ListingItem 
            key={listing.id}
            listing={listing}
            />
        ))}
    </div>
  )
}

export default ListingList

//.sort( (a,b) => a.price > b.price ? 1 : -1)