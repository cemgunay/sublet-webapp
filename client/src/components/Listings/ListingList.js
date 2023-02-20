import React from 'react'
import ListingItem from './ListingItem'

import classes from './ListingList.module.css'

function ListingList(props) {
  return (
    <ul className={classes.list}>
      {props.listing.map(listing => (
        <ListingItem 
            key={listing.id} 
            id={listing.id} 
            image={listing.image}
            title={listing.title}
            address={listing.address}
            description={listing.description} 
            />
        ))}  
    </ul>
  )
}

export default ListingList