import React, { useContext, useEffect, useState } from 'react'
import BottomNav from '../../../components/BottomNav/BottomNav'
import ListingList from '../../../components/Util/Listings/ListingList'
import { AuthContext } from '../../../context/AuthContext'
import api from "../../../api/axios";

import classes from './SubletsSubtenant.module.css'

function SubletsSubtenant() {

    const { user: currentUser } = useContext(AuthContext)

    const [requests, setRequests] = useState([])
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
              const requestsResponse = await api.get(
                "/requests/myrequests/" + currentUser._id
              );
              console.log(requestsResponse.data);
              setRequests(requestsResponse.data);

              const listingPromises = requestsResponse.data.map(request => 
                api.get('/listings/' + request.listingId))

            const listingsResponse = await Promise.all(listingPromises)

            console.log(listingsResponse)

            setListings(listingsResponse.map(response => response.data))

            setLoading(false)
            } catch (err) {
              console.error(err);
            }
          };
      
          fetchRequests()
    }, [currentUser])
    
    console.log(requests)
    console.log(listings)

  return (
    <>
      <section className={classes.container}>
        <h1> My subLets</h1>
        <p>{listings.length} subLets</p>
        <div>
          {loading ? <div>loading</div> : 
          <ListingList requests={requests} listings={listings} />}
        </div>
      </section>
      <footer className={classes.footer}>
        <BottomNav />
      </footer>
    </>
  )
}

export default SubletsSubtenant