import React from "react";
import Slider from "react-slick";

import classes from './Carousel.module.css'

function Carousel(props) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log(props.images);

  return (
    <Slider {...settings}>
        {props.images.map((element, i) => (
          <img className={classes.image} key={i} src={element} alt={element} />
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
