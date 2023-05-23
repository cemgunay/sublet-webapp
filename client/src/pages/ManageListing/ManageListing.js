import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MonthGrid from "../../components/Util/MonthGrid";

import classes from "./ManageListing.module.css";

import api from "../../api/axios";
import Carousel from "../../components/Carousel/Carousel";
import useListFormContext from "../../hooks/useListFormContext";

function ManageListing() {
  //get listing if coming from all listings
  const location = useLocation();
  console.log(location.state);

  const {data} = useListFormContext();

  console.log(data)

  //for navigation
  const navigate = useNavigate();

  //for listing
  const [listing, setListing] = useState(null);

  console.log(listing);

  //for amenities to be displayed as a list
  let amenities = [];
  if (listing && listing.amenities) {
    amenities = Object.keys(listing.amenities).filter(
      (key) => listing.amenities[key]
    );
  }

  //for listing id from parameters
  const { id } = useParams();

  //to format address
  const formattedAddress = listing
    ? `${listing.location.address1}, ${listing.location.city}, ${listing.location.stateprovince}`
    : "";

  //for images
  const images = listing?.images?.map(({ url }) => url) || [];

  useEffect(() => {
    if (location.state) {
      setListing(location.state.listing);
    } else {
      api
        .get("/listings/" + id)
        .then((response) => {
          setListing(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [location.state]);

  const handlePreviewClick = (listing) => {
    navigate("/host/listing/manage-your-listing/" + id + "/preview", {
      state: { listing },
    });
  };

  return (
    <div className={classes.container}>
      {!listing ? (
        <div>Loading</div>
      ) : (
        <div>
          <div>{listing.title}</div>
          <button onClick={() => handlePreviewClick(listing)}>
            Preview Listing
          </button>
          <div className={classes.contentcontainer}>
            <div className={classes.header}>Listing Details</div>
            <div className={classes.detailscontainer}>
              <div className={classes.detailstitle}>Listing Basics</div>
              <div className={classes.detailscontent}>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Listing title
                    </div>
                    <div className={classes.detailsitemcontent}>
                      {listing.title}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Listing description
                    </div>
                    <div className={classes.detailsitemcontent}>
                      {listing.description}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Listing status???
                    </div>
                    <div className={classes.detailsitemcontent}>
                      {listing.published.toString()}
                      <div>
                        This might be clutch to manually set to published or not
                      </div>
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
              </div>
            </div>
            <div className={classes.detailscontainer}>
              <div className={classes.detailstitle}>Amenities</div>
              <div className={classes.detailscontent}>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemcontent}>
                      {amenities.join(", ")}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
              </div>
            </div>
            <div className={classes.detailscontainer}>
              <div className={classes.detailstitle}>Location</div>
              <div className={classes.detailscontent}>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>Address</div>
                    <div className={classes.detailsitemcontent}>
                      {formattedAddress}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
              </div>
            </div>
            <div className={classes.detailscontainer}>
              <div className={classes.detailstitle}>Property and rooms</div>
              <div className={classes.detailscontent}>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>Property</div>
                    <div className={classes.detailsitemcontent}>
                      Property Type: {listing.aboutyourplace.propertyType}
                    </div>
                    <div className={classes.detailsitemcontent}>
                      Privacy Type: {listing.aboutyourplace.privacyType}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Bedrooms and bathrooms
                    </div>
                    <div className={classes.detailsitemcontent}>
                      Bedrooms: {listing.basics.bedrooms.length}
                    </div>
                    <div className={classes.detailsitemcontent}>
                      Bathrooms: {listing.basics.bathrooms}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
              </div>
            </div>
            <div className={classes.detailscontainer}>
              <div className={classes.detailstitle}>
                <div>Photos</div>
                <div className={classes.detailsitemright}>Edit</div>
              </div>
              <div className={classes.detailscontent}>
                <div className={classes.carouselcontainer}>
                  <Carousel
                    dots={false}
                    images={images}
                    index={0}
                    from={"ManageListing"}
                    slidesToShow={2}
                    addMargins={true}
                    setWidth={true}
                    borderRadius={true}
                  />
                </div>
              </div>
            </div>
            <div className={classes.detailscontainer}>
              <div className={classes.detailstitle}>
                Pricing and Availability
              </div>
              <div className={classes.detailscontent}>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Monthly Price
                    </div>
                    <div className={classes.detailsitemcontent}>
                      ${listing.price} CAD
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Available for longer or shorter stays?
                    </div>
                    <div className={classes.detailsitemcontent}>
                      {listing.shorterStays ? "True" : "False"}
                    </div>
                  </div>
                  <div className={classes.detailsitemright}>Edit</div>
                </div>
                <div className={classes.detailsitem}>
                  <div className={classes.detailsitemleft}>
                    <div className={classes.detailsitemtitle}>
                      Available Dates
                    </div>
                    <div className={classes.detailsitemcontent}>
                      <MonthGrid
                        defaultMoveInDate={listing.moveInDate}
                        defaultMoveOutDate={listing.moveOutDate}
                        moveInDate={listing.moveInDate}
                        moveOutDate={listing.moveOutDate}
                        shorterStays={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageListing;
