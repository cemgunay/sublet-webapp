import React, { useState } from "react";
import Slider from "react-slick";

import "./CarouselElement.css";

function Carousel(props) {

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: props.dots,
    initialSlide: props.index
  };

  const handleOnChange = (currentImage) => {
    if (props.from === 'Collage') {
    props.setData({ ...props.data, i: currentImage })
    }
  }
  
  return (
    <Slider {...settings} afterChange={handleOnChange}>
      {props.images.map((element, i) => (
        <img key={i} src={element} alt={element} onClick={props.onClick}/>
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
