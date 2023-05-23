import React, { useState, useEffect, useContext } from "react";
import BottomNav from "../../components/BottomNav/BottomNav";
import ListingList from "../../components/Util/Listings/ListingList";
import api from "../../api/axios";
//import api from '../../api/axios'
import { AuthContext } from "../../context/AuthContext";

import classes from "./Explore.module.css";

function Explore() {
  const { user: currentUser } = useContext(AuthContext);

  console.log("rerender explore");

  const [listings, setListings] = useState([]);

  //getting all listings that arent booked and are published
  /*
  If the booking startDate is less than the end of the desired range (endDate) 
  and the booking endDate is greater than or equal to the start of the desired range (startDate), 
  then there is an overlap, and the listing is considered booked for that month.
  */
  useEffect(() => {
    const fetchListings = async () => {
      const filters = {
        price: [10, 10000],
        startDate: "2023-05-01",
        endDate: "2024-10-14",
      };

      const res = await api.get("/listings", {
        params: {
          filters: JSON.stringify(filters),
        },
      });

      console.log(res);
      setListings(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchListings();
  }, []);

  console.log(listings);

  return (
    <>
      <section className={classes.container}>
        <h1> All listings</h1>
        {currentUser ? <div>Welcome back {currentUser.firstName}</div> : null}
        <p>{listings.length} listings</p>
        <div>
          <ListingList listings={listings} />
        </div>
      </section>
      <footer className={classes.footer}>
        <BottomNav />
      </footer>
    </>
  );
}

export default Explore;
