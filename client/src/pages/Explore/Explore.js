import React, {useState} from 'react'
import ListingList from '../../components/Listings/ListingList';
import dummydata from '../../dummy/dummy-data.json'

import classes from './Explore.module.css'

function Explore() {

  const [listings, setListings] = useState(dummydata)
  //const [sort, setSort] = useState("ASC")

  return (
    <section>
      <h1> All listings</h1>
      <p>{listings.length} listings</p>
      <div className={classes.container}>
        <ListingList listings={listings}/>
      </div>
    </section>
  )
}

export default Explore

//DONT DELETE
//const [listings, setListings] = useState()
//const {DUMMY_DATA} = require('../../dummy/dummy-data');