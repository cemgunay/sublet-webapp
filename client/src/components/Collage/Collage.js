import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Carousel from "../Carousel/Carousel";

import classes from './Collage.module.css'

function Collage(props) {
  const images = props.images;

  const [data, setData] = useState({ img: "", i: 0 });

  const viewImage = (img, i) => {
    setData({ img, i });
  };

  return (
    <div className={classes.collageModal}>
    {data.img && 
    
    <div className={classes.modal}>
        <div className={classes.carousel}>
        <Carousel images={images}/>
        </div>
                
        </div>}


    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry>
        {images.map((image, i) => (
          <img
          className={classes.image}
            key={i}
            src={image}
            alt={image}
            onClick={() => viewImage(image, i)}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
    </div>
    
  );
}

export default Collage;
