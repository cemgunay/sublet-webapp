import Carousel from '../Carousel/Carousel';
import { useState } from 'react';

import Masonry from 'react-masonry-css'

import './Collage2.css'

import classes from './Collage.module.css'

function Collage2(props) {
    const images = props.images;

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 2
      };
  
    const [data, setData] = useState({ img: "", i: 0 });
  
    const viewImage = (img, i) => {
      setData({ img, i });
    };
  
    return (
      <div>
      {data.img && 
      
      <div className={classes.modal}>
          <div className={classes.carousel}>
          <Carousel images={images}/>
          </div>
                  
          </div>}

      <Masonry
  breakpointCols={breakpointColumnsObj}
  className="my-masonry-grid"
  columnClassName="my-masonry-grid_column">
  {images.map((image, i) => (
            <div>
                <img 
              key={i}
              src={image}
              alt={image}
              onClick={() => viewImage(image, i)} />
            </div>
          ))}
</Masonry>
      </div>
      
    );
  }
  
  export default Collage2;