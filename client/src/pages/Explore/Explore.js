import React, {useState, useEffect} from 'react'
import BottomNav from '../../components/BottomNav/BottomNav';
import ListingList from '../../components/Listings/ListingList';
import axios from 'axios';

import classes from './Explore.module.css'

function Explore() {

  const [listings, setListings] = useState([])
  //const [sort, setSort] = useState("ASC")

  useEffect(() => {
    axios.get("/dummy/dummy-data.json").then(response => {
        console.log(response.data)
        setListings(response.data)
    }).catch(error => console.log(error));
  }, []);

  return (
    <>
    <section className={classes.container}>
      <h1> All listings</h1>
      <p>{listings.length} listings</p>
      <div>
        <ListingList listings={listings}/>
      </div>
    </section>
    <footer className={classes.footer}>
      <BottomNav />
    </footer>
    </>
  )
}

export default Explore

//DONT DELETE
//const [listings, setListings] = useState()
//const {DUMMY_DATA} = require('../../dummy/dummy-data');