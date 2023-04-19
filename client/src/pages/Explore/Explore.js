import React, { useState, useEffect, useContext } from "react";
import BottomNav from "../../components/BottomNav/BottomNav";
import ListingList from "../../components/Listings/ListingList";
import axios from "axios";
import api from "../../api/axios";
//import api from '../../api/axios'
import { AuthContext } from "../../context/AuthContext";

import classes from "./Explore.module.css";

function Explore() {

  const { user } = useContext(AuthContext);

  console.log("rerender explore");

  const [listings, setListings] = useState([]);

  //OLD WAY WITH DUMMY DATA
  /*
  useEffect(() => {
    axios.get("/dummy/dummy-data.json").then(response => {
      setListings(response.data)
      console.log('rerender useeffect')
    }).catch(error => console.log(error));
  }, []); 
  */

  useEffect(() => {
    const fetchListings = async () => {

      const filters = {
        price: [100, 10000],
        propertyType: "house"
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

  console.log(listings)

  return (
    <>
      <section className={classes.container}>
        <h1> All listings</h1>
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
