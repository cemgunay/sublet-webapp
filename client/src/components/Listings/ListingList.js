import React from 'react'
import ListingItem from './ListingItem'

import classes from './ListingList.module.css'

function ListingList(props) {
  return (
    <div className={classes.container}>
      {props.listings
      .map(listing => (
        <ListingItem 
            key={listing.id} 
            id={listing.id} 
            image={listing.image}
            title={listing.title}
            address={listing.address}
            description={listing.description} 
            days_left={listing.days_left}
            dates={listing.dates}
            price={listing.price}
            views={listing.views}
            />
        ))}  
    </div>
  )
}

export default ListingList

//.sort( (a,b) => a.price > b.price ? 1 : -1)