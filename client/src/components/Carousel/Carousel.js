import React, { useState } from "react";
import Slider from "react-slick";

import classes from "./Carousel.module.css";
import "./CarouselElement.css";

function Carousel(props) {

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: props.dots,
  };

  return (
    <Slider {...settings}>
      {props.images.map((element, i) => (
        <img className={classes.image} key={i} src={element} alt={element} onClick={props.onClick}/>
      ))}
    </Slider>
  );
}

export default Carousel;

/* 

{listing.image.length > 1 && listing.image
      .map((images, i) => (
        <Carousel
            key={i}
            image={images}
            />
        ))}

*/
