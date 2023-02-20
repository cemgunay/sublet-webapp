import React from 'react'
import ListingList from '../../components/Listings/ListingList';

import classes from './Explore.module.css'

function Explore() {

  const { DUMMY_DATA } = require('../../dummy/dummy-data');

  return (
    <section>
      <h1> All listings</h1>
      <div className={classes.container}>
        <ListingList listing={DUMMY_DATA}/>
      </div>
    </section>
  )
}

export default Explore